import re
from rest_framework import serializers
from .models import LostFoundItem

class LostFoundItemSerializer(serializers.ModelSerializer):
    """
    ModelSerializer for LostFoundItem.
    Enforces strict backend validation matching academic requirements.
    """
    class Meta:
        model = LostFoundItem
        fields = [
            'id',
            'item_name',
            'description',
            'category',
            'status',
            'location',
            'date_lost_found',
            'reported_by',
            'student_email',
            'phone',
            'image_url',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_item_name(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Item name is required.")
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Item name must be at least 2 characters long.")
        return value.strip()

    def validate_description(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Description is required.")
        return value.strip()

    def validate_location(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Location is required.")
        return value.strip()

    def validate_reported_by(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Reported by (Student Name) is required.")
        return value.strip()

    def validate_student_email(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Student email is required.")
        email_regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
        if not re.match(email_regex, value.strip()):
            raise serializers.ValidationError("Please enter a valid email address.")
        return value.strip().lower()

    def validate_phone(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Phone number is required.")
        clean_phone = re.sub(r'[\s\-\(\)\+]', '', value)
        if not clean_phone.isdigit() or len(clean_phone) < 7 or len(clean_phone) > 15:
            raise serializers.ValidationError("Please enter a valid 10-digit phone number.")
        return value.strip()

    def validate_category(self, value):
        valid_categories = [c[0] for c in LostFoundItem.CATEGORY_CHOICES]
        if value not in valid_categories:
            raise serializers.ValidationError(
                f"Invalid category '{value}'. Must be one of: {', '.join(valid_categories)}"
            )
        return value

    def validate_status(self, value):
        valid_statuses = [s[0] for s in LostFoundItem.STATUS_CHOICES]
        if value not in valid_statuses:
            raise serializers.ValidationError(
                f"Invalid status '{value}'. Must be one of: {', '.join(valid_statuses)}"
            )
        return value
