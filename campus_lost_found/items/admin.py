from django.contrib import admin
from .models import LostFoundItem

@admin.register(LostFoundItem)
class LostFoundItemAdmin(admin.ModelAdmin):
    """
    Django Admin registration for LostFoundItem.
    Provides comprehensive management, filtering, searching, and bulk actions.
    """
    list_display = [
        'id',
        'item_name',
        'category',
        'status',
        'location',
        'date_lost_found',
        'reported_by',
        'student_email',
        'phone',
        'created_at',
    ]

    list_filter = [
        'status',
        'category',
        'date_lost_found',
        'created_at',
    ]

    search_fields = [
        'item_name',
        'location',
        'reported_by',
        'student_email',
        'phone',
        'description',
    ]

    date_hierarchy = 'date_lost_found'
    ordering = ['-created_at', '-id']
    list_per_page = 20

    fieldsets = (
        ('Item Overview', {
            'fields': ('item_name', 'description', 'category', 'status', 'image_url')
        }),
        ('Location & Date', {
            'fields': ('location', 'date_lost_found')
        }),
        ('Student / Reporter Contact', {
            'fields': ('reported_by', 'student_email', 'phone')
        }),
    )

    actions = ['mark_as_returned', 'mark_as_found']

    @admin.action(description='Mark selected items as Returned')
    def mark_as_returned(self, request, queryset):
        updated_count = queryset.update(status='Returned')
        self.message_user(request, f"{updated_count} item(s) successfully marked as Returned.")

    @admin.action(description='Mark selected items as Found')
    def mark_as_found(self, request, queryset):
        updated_count = queryset.update(status='Found')
        self.message_user(request, f"{updated_count} item(s) successfully marked as Found.")
