from flask import Blueprint, request, flash, redirect, url_for, current_app, render_template, session
import os
import json


# Создаем Blueprint
admin_bp = Blueprint('admin', __name__, template_folder='templates')

def get_models():
    """Функция для получения доступа к моделям и db из main.py."""
    from main import db, Admin, User
    return db, Admin, User

def load_clubs():
    """Load the clubs data from the JSON file."""
    try:
        with open(os.path.join(current_app.root_path, 'static', 'clubsData.json'), 'r') as f:
            clubs_data = json.load(f)
        return clubs_data['clubsData']
    except FileNotFoundError:
        return []

def save_clubs(clubs_data):
    """Save the updated clubs data to the JSON file."""
    try:
        with open(os.path.join(current_app.root_path, 'static', 'clubsData.json'), 'w') as f:
            json.dump({'clubsData': clubs_data}, f, indent=4)
        return True
    except Exception as e:
        print(f"Error saving clubs data: {e}")
        return False

@admin_bp.route('/admin_panel', methods=['GET'])
def admin_panel():
    """Display the admin panel with clubs data."""
    clubs_data = load_clubs()
    return render_template('admins.html', clubs_data=clubs_data)

@admin_bp.route('/save_club/<int:club_id>', methods=['POST'])
def save_club(club_id):
    """Save updated club data."""
    clubs_data = load_clubs()
    club_found = False
    for club in clubs_data:
        if club['id'] == club_id:
            # Update club details based on form input
            club['name'] = request.form.get('name', club['name'])
            club['description'] = request.form.get('description', club['description'])
            club['location']['address'] = request.form.get('address', club['location']['address'])
            club['administration']['number'] = request.form.get('phone', club['administration']['number'])
            club['working_hours'] = request.form.get('working_hours', club.get('working_hours', ''))
            club['photos'] = request.form.getlist('photos[]')
            if 'review_user[]' in request.form:
                review_users = request.form.getlist('review_user[]')
                review_ratings = request.form.getlist('review_rating[]')
                review_texts = request.form.getlist('review_text[]')
                club['reviews'] = [{'user': user, 'rating': int(rating), 'text': text} for user, rating, text in zip(review_users, review_ratings, review_texts)]
            club_found = True
            break
    if club_found:
        if save_clubs(clubs_data):
            flash('Club updated successfully!', 'success')
        else:
            flash('Failed to save club updates.', 'error')
    else:
        flash('Club not found.', 'error')
    return redirect(url_for('admin.admin_panel'))

@admin_bp.route('/assign_admin', methods=['POST'])
def assign_admin():
    db, Admin, _ = get_models()  # Получение доступа к моделям и db
    if 'username' in session and session['username'] == 'sp1ngo':
        new_admin_username = request.form.get('new_admin_username')
        existing_admin = Admin.query.filter_by(username=new_admin_username).first()
        if not existing_admin:
            new_admin = Admin(username=new_admin_username)
            db.session.add(new_admin)
            db.session.commit()
            flash('Новый администратор успешно назначен!', 'success')
        else:
            flash('Пользователь уже является администратором!', 'warning')
    else:
        flash('У вас нет прав для выполнения этой операции!', 'danger')
    return redirect(url_for('admin.admin_panel'))