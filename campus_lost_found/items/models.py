from django.db import models
from django.core.validators import RegexValidator

class LostFoundItem(models.Model):
    """
    Model representing a Lost or Found item on college campus.
    Satisfies academic SOP requirements for complete CRUD management.
    """
    CATEGORY_CHOICES = [
        ('Electronics', 'Electronics'),
        ('Books', 'Books'),
        ('ID Card', 'ID Card'),
        ('Wallet', 'Wallet'),
        ('Keys', 'Keys'),
        ('Clothing', 'Clothing'),
        ('Accessories', 'Accessories'),
        ('Documents', 'Documents'),
        ('Other', 'Other'),
    ]

    STATUS_CHOICES = [
        ('Lost', 'Lost'),
        ('Found', 'Found'),
        ('Returned', 'Returned'),
    ]

    item_name = models.CharField(
        max_length=200,
        help_text="Name or title of the lost or found item"
    )
    description = models.TextField(
        help_text="Detailed description, distinct features, marks, or circumstances"
    )
    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES,
        default='Other'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Lost'
    )
    location = models.CharField(
        max_length=200,
        help_text="Specific campus building, room, cafeteria, or sports complex location"
    )
    date_lost_found = models.DateField(
        help_text="Date when the item was misplaced or discovered"
    )
    reported_by = models.CharField(
        max_length=150,
        help_text="Full name of student or campus staff reporting this item"
    )
    student_email = models.EmailField(
        help_text="Official college or contact email address"
    )
    phone = models.CharField(
        max_length=20,
        validators=[
            RegexValidator(
                regex=r'^\+?1?\d{9,15}$',
                message="Phone number must be entered in the format: '+999999999' or 10 digits."
            )
        ],
        help_text="Primary contact phone number"
    )
    image_url = models.URLField(
        max_length=500,
        blank=True,
        null=True,
        help_text="Optional web URL of photo of the item"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when the report was initially submitted"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Timestamp when the report was last updated"
    )

    class Meta:
        ordering = ['-created_at', '-id']
        verbose_name = "Lost & Found Item"
        verbose_name_plural = "Lost & Found Items"

    def __str__(self):
        return f"{self.item_name} [{self.status}] - {self.category} ({self.location})"
