#!/usr/bin/env python3
"""
SQLite Database Manager for Campus Lost & Found System
Directly manages db.sqlite3 using standard Python SQLite3 library.
"""
import sys
import json
import sqlite3
import datetime
import os
import re

DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'db.sqlite3')

VALID_CATEGORIES = [
    'Electronics', 'Books', 'ID Card', 'Wallet', 
    'Keys', 'Clothing', 'Accessories', 'Documents', 'Other'
]

VALID_STATUSES = ['Lost', 'Found', 'Returned']

SAMPLE_ITEMS = [
    {
        "item_name": "Black Leather Wallet",
        "description": "Black leather bi-fold wallet containing student ID card, transit pass, and cash. Found near desk #14.",
        "category": "Wallet",
        "status": "Lost",
        "location": "Central Library - 2nd Floor Reading Hall",
        "date_lost_found": "2026-09-17",
        "reported_by": "Alex Rivera",
        "student_email": "alex.rivera@campus.edu",
        "phone": "9876543210",
        "image_url": "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80"
    },
    {
        "item_name": "Hydro Flask Blue Water Bottle",
        "description": "32oz stainless steel navy blue water bottle with college engineering stickers and minor dent on bottom rim.",
        "category": "Other",
        "status": "Found",
        "location": "Student Union Canteen - Table 8",
        "date_lost_found": "2026-09-16",
        "reported_by": "Priya Sharma",
        "student_email": "priya.s@campus.edu",
        "phone": "9876543211",
        "image_url": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80"
    },
    {
        "item_name": "College Student ID Card",
        "description": "Official Department of Computer Science student identity card issued for 2024-2028 batch.",
        "category": "ID Card",
        "status": "Found",
        "location": "Main Academic Block - East Stairwell",
        "date_lost_found": "2026-09-15",
        "reported_by": "Campus Security Desk",
        "student_email": "security@campus.edu",
        "phone": "9876543212",
        "image_url": "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80"
    },
    {
        "item_name": "Sony Wireless Noise Cancelling Earbuds",
        "description": "Black Sony WF-1000XM4 earbuds in matte charging case with a small carbon fiber protective sleeve.",
        "category": "Electronics",
        "status": "Lost",
        "location": "Science Block - Lecture Hall 302",
        "date_lost_found": "2026-09-14",
        "reported_by": "Daniel Kim",
        "student_email": "daniel.k@campus.edu",
        "phone": "9876543213",
        "image_url": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80"
    },
    {
        "item_name": "Calculus Early Transcendentals Textbook",
        "description": "8th Edition hardcover textbook with yellow highlighting in chapters 4 and 5.",
        "category": "Books",
        "status": "Returned",
        "location": "Mathematics Department Lab",
        "date_lost_found": "2026-09-12",
        "reported_by": "Sarah Jenkins",
        "student_email": "sarah.j@campus.edu",
        "phone": "9876543214",
        "image_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80"
    },
    {
        "item_name": "Dorm Room Keys with Red Campus Lanyard",
        "description": "Set of 3 brass keys with red campus athletic department lanyard and a small silver flashlight.",
        "category": "Keys",
        "status": "Lost",
        "location": "Sports Complex - Gymnasium Bleachers",
        "date_lost_found": "2026-09-17",
        "reported_by": "Marcus Chen",
        "student_email": "marcus.c@campus.edu",
        "phone": "9876543215",
        "image_url": "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80"
    }
]

def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cur = conn.cursor()
    cur.execute('''
    CREATE TABLE IF NOT EXISTS items_lostfounditem (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_name TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        status TEXT NOT NULL,
        location TEXT NOT NULL,
        date_lost_found TEXT NOT NULL,
        reported_by TEXT NOT NULL,
        student_email TEXT NOT NULL,
        phone TEXT NOT NULL,
        image_url TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    )
    ''')
    conn.commit()

    # Check if empty, seed initial data
    cur.execute('SELECT COUNT(*) as cnt FROM items_lostfounditem')
    count = cur.fetchone()['cnt']
    if count == 0:
        now = datetime.datetime.now().isoformat()
        for item in SAMPLE_ITEMS:
            cur.execute('''
            INSERT INTO items_lostfounditem 
            (item_name, description, category, status, location, date_lost_found, reported_by, student_email, phone, image_url, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                item['item_name'], item['description'], item['category'],
                item['status'], item['location'], item['date_lost_found'],
                item['reported_by'], item['student_email'], item['phone'],
                item.get('image_url', ''), now, now
            ))
        conn.commit()
    conn.close()

def validate_item(data, is_update=False):
    errors = {}
    if not is_update or 'item_name' in data:
        if not data.get('item_name') or not str(data.get('item_name')).strip():
            errors['item_name'] = 'Item name is required.'
    
    if not is_update or 'description' in data:
        if not data.get('description') or not str(data.get('description')).strip():
            errors['description'] = 'Description is required.'

    if not is_update or 'category' in data:
        cat = data.get('category')
        if not cat or cat not in VALID_CATEGORIES:
            errors['category'] = f'Category is required and must be one of: {", ".join(VALID_CATEGORIES)}.'

    if not is_update or 'status' in data:
        st = data.get('status')
        if not st or st not in VALID_STATUSES:
            errors['status'] = f'Status is required and must be one of: {", ".join(VALID_STATUSES)}.'

    if not is_update or 'location' in data:
        if not data.get('location') or not str(data.get('location')).strip():
            errors['location'] = 'Location is required.'

    if not is_update or 'date_lost_found' in data:
        if not data.get('date_lost_found') or not str(data.get('date_lost_found')).strip():
            errors['date_lost_found'] = 'Date is required.'

    if not is_update or 'reported_by' in data:
        if not data.get('reported_by') or not str(data.get('reported_by')).strip():
            errors['reported_by'] = 'Reported by (Student Name) is required.'

    if not is_update or 'student_email' in data:
        email = str(data.get('student_email', '')).strip()
        if not email:
            errors['student_email'] = 'Student email is required.'
        elif not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', email):
            errors['student_email'] = 'Please enter a valid email address.'

    if not is_update or 'phone' in data:
        phone = str(data.get('phone', '')).strip()
        clean_phone = re.sub(r'[\s\-\(\)\+]', '', phone)
        if not phone:
            errors['phone'] = 'Phone number is required.'
        elif len(clean_phone) < 7 or len(clean_phone) > 15 or not clean_phone.isdigit():
            errors['phone'] = 'Please enter a valid phone number (e.g. 10 digits).'

    return errors

def list_items(search='', status='', category='', ordering='-created_at'):
    conn = get_db()
    cur = conn.cursor()
    query = 'SELECT * FROM items_lostfounditem WHERE 1=1'
    params = []

    if status and status != 'All':
        query += ' AND status = ?'
        params.append(status)

    if category and category != 'All':
        query += ' AND category = ?'
        params.append(category)

    if search:
        search_pattern = f'%{search}%'
        query += ' AND (item_name LIKE ? OR location LIKE ? OR category LIKE ? OR reported_by LIKE ? OR description LIKE ?)'
        params.extend([search_pattern, search_pattern, search_pattern, search_pattern, search_pattern])

    # Ordering
    if ordering == '-created_at' or ordering == '-id':
        query += ' ORDER BY id DESC'
    elif ordering == 'created_at' or ordering == 'id':
        query += ' ORDER BY id ASC'
    elif ordering == '-date_lost_found':
        query += ' ORDER BY date_lost_found DESC, id DESC'
    elif ordering == 'date_lost_found':
        query += ' ORDER BY date_lost_found ASC, id ASC'
    else:
        query += ' ORDER BY id DESC'

    cur.execute(query, params)
    rows = [dict(r) for r in cur.fetchall()]
    conn.close()
    return rows

def get_item(item_id):
    conn = get_db()
    cur = conn.cursor()
    cur.execute('SELECT * FROM items_lostfounditem WHERE id = ?', (item_id,))
    row = cur.fetchone()
    conn.close()
    return dict(row) if row else None

def create_item(data):
    errors = validate_item(data, is_update=False)
    if errors:
        return {"error": "Validation failed", "validation_errors": errors}, 400

    now = datetime.datetime.now().isoformat()
    conn = get_db()
    cur = conn.cursor()
    cur.execute('''
    INSERT INTO items_lostfounditem 
    (item_name, description, category, status, location, date_lost_found, reported_by, student_email, phone, image_url, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        data['item_name'].strip(),
        data['description'].strip(),
        data['category'].strip(),
        data['status'].strip(),
        data['location'].strip(),
        data['date_lost_found'].strip(),
        data['reported_by'].strip(),
        data['student_email'].strip(),
        data['phone'].strip(),
        data.get('image_url', '').strip(),
        now, now
    ))
    conn.commit()
    new_id = cur.lastrowid
    conn.close()
    return get_item(new_id), 201

def update_item(item_id, data, partial=False):
    existing = get_item(item_id)
    if not existing:
        return {"error": "Item not found"}, 404

    errors = validate_item(data, is_update=partial)
    if errors:
        return {"error": "Validation failed", "validation_errors": errors}, 400

    fields = ['item_name', 'description', 'category', 'status', 'location', 
              'date_lost_found', 'reported_by', 'student_email', 'phone', 'image_url']
    
    updates = {}
    for f in fields:
        if f in data:
            updates[f] = data[f].strip() if isinstance(data[f], str) else data[f]
        elif not partial:
            updates[f] = existing[f]

    now = datetime.datetime.now().isoformat()
    updates['updated_at'] = now

    set_clause = ', '.join([f'{k} = ?' for k in updates.keys()])
    params = list(updates.values()) + [item_id]

    conn = get_db()
    cur = conn.cursor()
    cur.execute(f'UPDATE items_lostfounditem SET {set_clause} WHERE id = ?', params)
    conn.commit()
    conn.close()
    return get_item(item_id), 200

def delete_item(item_id):
    existing = get_item(item_id)
    if not existing:
        return {"error": "Item not found"}, 404

    conn = get_db()
    cur = conn.cursor()
    cur.execute('DELETE FROM items_lostfounditem WHERE id = ?', (item_id,))
    conn.commit()
    conn.close()
    return {"message": "Item deleted successfully", "id": item_id}, 200

def mark_returned(item_id):
    existing = get_item(item_id)
    if not existing:
        return {"error": "Item not found"}, 404

    now = datetime.datetime.now().isoformat()
    conn = get_db()
    cur = conn.cursor()
    cur.execute('UPDATE items_lostfounditem SET status = ?, updated_at = ? WHERE id = ?', ('Returned', now, item_id))
    conn.commit()
    conn.close()
    return get_item(item_id), 200

def get_stats():
    conn = get_db()
    cur = conn.cursor()
    cur.execute('SELECT COUNT(*) as total FROM items_lostfounditem')
    total = cur.fetchone()['total']

    cur.execute('SELECT COUNT(*) as lost FROM items_lostfounditem WHERE status = ?', ('Lost',))
    lost = cur.fetchone()['lost']

    cur.execute('SELECT COUNT(*) as found FROM items_lostfounditem WHERE status = ?', ('Found',))
    found = cur.fetchone()['found']

    cur.execute('SELECT COUNT(*) as returned FROM items_lostfounditem WHERE status = ?', ('Returned',))
    returned = cur.fetchone()['returned']

    # Breakdown by category
    cur.execute('SELECT category, COUNT(*) as cnt FROM items_lostfounditem GROUP BY category ORDER BY cnt DESC')
    by_category = {r['category']: r['cnt'] for r in cur.fetchall()}

    conn.close()
    return {
        "total": total,
        "lost": lost,
        "found": found,
        "returned": returned,
        "by_category": by_category
    }

def reset_sample_data():
    conn = get_db()
    cur = conn.cursor()
    cur.execute('DROP TABLE IF EXISTS items_lostfounditem')
    conn.commit()
    conn.close()
    init_db()
    return {"message": "Sample data reset successfully"}, 200

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No command provided"}))
        sys.exit(1)

    cmd = sys.argv[1]

    if cmd == 'init':
        init_db()
        print(json.dumps({"status": "initialized"}))

    elif cmd == 'list':
        # Optional args: search, status, category, ordering
        search = sys.argv[2] if len(sys.argv) > 2 else ''
        status = sys.argv[3] if len(sys.argv) > 3 else ''
        category = sys.argv[4] if len(sys.argv) > 4 else ''
        ordering = sys.argv[5] if len(sys.argv) > 5 else '-id'
        items = list_items(search, status, category, ordering)
        print(json.dumps(items))

    elif cmd == 'get':
        item_id = int(sys.argv[2])
        res = get_item(item_id)
        if res:
            print(json.dumps(res))
        else:
            print(json.dumps({"error": "Item not found"}))
            sys.exit(2)

    elif cmd == 'create':
        input_data = json.loads(sys.stdin.read())
        res, status_code = create_item(input_data)
        print(json.dumps(res))
        if status_code != 201:
            sys.exit(1)

    elif cmd == 'update':
        item_id = int(sys.argv[2])
        input_data = json.loads(sys.stdin.read())
        partial = len(sys.argv) > 3 and sys.argv[3] == '--partial'
        res, status_code = update_item(item_id, input_data, partial)
        print(json.dumps(res))
        if status_code != 200:
            sys.exit(1)

    elif cmd == 'delete':
        item_id = int(sys.argv[2])
        res, status_code = delete_item(item_id)
        print(json.dumps(res))
        if status_code != 200:
            sys.exit(1)

    elif cmd == 'mark_returned':
        item_id = int(sys.argv[2])
        res, status_code = mark_returned(item_id)
        print(json.dumps(res))
        if status_code != 200:
            sys.exit(1)

    elif cmd == 'stats':
        res = get_stats()
        print(json.dumps(res))

    elif cmd == 'reset':
        res, status_code = reset_sample_data()
        print(json.dumps(res))
