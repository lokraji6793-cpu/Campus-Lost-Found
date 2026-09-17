from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import LostFoundItem

class LostFoundItemAPITests(APITestCase):
    """
    Automated backend test suite covering 10 required academic test scenarios:
    1. Item creation
    2. Item list retrieval
    3. Single item retrieval
    4. Item update (PUT / PATCH)
    5. Item deletion
    6. Required field validation
    7. Email validation
    8. Phone number validation
    9. Search functionality
    10. Filter by status
    """

    def setUp(self):
        """Create sample data for test scenarios"""
        self.item1 = LostFoundItem.objects.create(
            item_name="Dell Inspiron Laptop 15",
            description="Black Dell laptop left in CS Lab 301 near desktop 12",
            category="Electronics",
            status="Lost",
            location="CS Lab 301",
            date_lost_found="2026-09-15",
            reported_by="Arjun Sharma",
            student_email="arjun.sharma@college.edu",
            phone="9876543210"
        )
        self.item2 = LostFoundItem.objects.create(
            item_name="Blue College ID Card",
            description="Student identity card belonging to Priya Verma, Batch 2026",
            category="ID Card",
            status="Found",
            location="Central Cafeteria Counter 2",
            date_lost_found="2026-09-16",
            reported_by="Rohan Gupta",
            student_email="rohan.gupta@college.edu",
            phone="9123456780"
        )
        self.list_url = reverse('lostfounditem-list')

    # Test 1: Item creation
    def test_01_create_item_success(self):
        payload = {
            "item_name": "Scientific Calculator Casio fx-991EX",
            "description": "Left on 3rd floor reading hall table 14",
            "category": "Electronics",
            "status": "Found",
            "location": "Central Library Floor 3",
            "date_lost_found": "2026-09-17",
            "reported_by": "Neha Patel",
            "student_email": "neha.patel@college.edu",
            "phone": "9876543211",
            "image_url": "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=400&q=80"
        }
        response = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['item_name'], "Scientific Calculator Casio fx-991EX")
        self.assertEqual(response.data['status'], "Found")
        self.assertEqual(LostFoundItem.objects.count(), 3)

    # Test 2: Item list retrieval
    def test_02_get_items_list(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    # Test 3: Single item retrieval
    def test_03_get_single_item(self):
        detail_url = reverse('lostfounditem-detail', kwargs={'pk': self.item1.id})
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.item1.id)
        self.assertEqual(response.data['item_name'], self.item1.item_name)

    # Test 4: Item update (PUT/PATCH)
    def test_04_update_item(self):
        detail_url = reverse('lostfounditem-detail', kwargs={'pk': self.item1.id})
        patch_payload = {
            "location": "Main Administration Office Room 102",
            "status": "Found"
        }
        response = self.client.patch(detail_url, patch_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['location'], "Main Administration Office Room 102")
        self.assertEqual(response.data['status'], "Found")

        self.item1.refresh_from_db()
        self.assertEqual(self.item1.location, "Main Administration Office Room 102")
        self.assertEqual(self.item1.status, "Found")

    # Test 5: Item deletion
    def test_05_delete_item(self):
        detail_url = reverse('lostfounditem-detail', kwargs={'pk': self.item2.id})
        response = self.client.delete(detail_url)
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_204_NO_CONTENT])
        self.assertEqual(LostFoundItem.objects.count(), 1)
        self.assertFalse(LostFoundItem.objects.filter(id=self.item2.id).exists())

    # Test 6: Required field validation
    def test_06_required_fields_validation(self):
        payload = {
            "item_name": "",  # Empty
            "description": "",
            "category": "Electronics",
            "status": "Lost"
        }
        response = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('item_name', response.data)
        self.assertIn('description', response.data)

    # Test 7: Email validation
    def test_07_invalid_email_validation(self):
        payload = {
            "item_name": "Leather Wallet",
            "description": "Brown leather wallet with currency",
            "category": "Wallet",
            "status": "Lost",
            "location": "Cafeteria",
            "date_lost_found": "2026-09-17",
            "reported_by": "Test Student",
            "student_email": "invalid-not-an-email",
            "phone": "9876543210"
        }
        response = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('student_email', response.data)

    # Test 8: Phone number validation
    def test_08_invalid_phone_validation(self):
        payload = {
            "item_name": "House Keys",
            "description": "Bunch of keys on a red keychain",
            "category": "Keys",
            "status": "Found",
            "location": "Auditorium Gate 1",
            "date_lost_found": "2026-09-17",
            "reported_by": "Security Guard",
            "student_email": "guard@college.edu",
            "phone": "123"  # Too short
        }
        response = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('phone', response.data)

    # Test 9: Search functionality
    def test_09_search_functionality(self):
        response = self.client.get(f"{self.list_url}?search=Laptop")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['item_name'], "Dell Inspiron Laptop 15")

        # Test search with no matching results
        empty_response = self.client.get(f"{self.list_url}?search=UnicornNotFound")
        self.assertEqual(empty_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(empty_response.data), 0)

    # Test 10: Filter by status
    def test_10_filter_by_status(self):
        lost_response = self.client.get(f"{self.list_url}?status=Lost")
        self.assertEqual(lost_response.status_code, status.HTTP_200_OK)
        self.assertTrue(all(item['status'] == 'Lost' for item in lost_response.data))

        found_response = self.client.get(f"{self.list_url}?status=Found")
        self.assertEqual(found_response.status_code, status.HTTP_200_OK)
        self.assertTrue(all(item['status'] == 'Found' for item in found_response.data))
