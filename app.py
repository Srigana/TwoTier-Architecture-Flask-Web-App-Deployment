import os
import time
import MySQLdb
from flask import Flask, render_template, request, jsonify
from flask_mysqldb import MySQL

app = Flask(__name__)

app.config['MYSQL_HOST'] = os.environ.get('MYSQL_HOST', 'mysql')
app.config['MYSQL_USER'] = os.environ.get('MYSQL_USER', 'root')
app.config['MYSQL_PASSWORD'] = os.environ.get('MYSQL_PASSWORD', 'root')
app.config['MYSQL_DB'] = os.environ.get('MYSQL_DB', 'devops')

mysql = MySQL(app)


def wait_for_db(retries=10, delay=3):
    for i in range(retries):
        try:
            cur = mysql.connection.cursor()
            cur.execute("SELECT 1")
            cur.close()
            return
        except Exception as e:
            print(f"DB not ready ({i+1}/{retries}): {e}")
            time.sleep(delay)
    raise RuntimeError("MySQL not available")


def init_db():
    """Create the messages table if it does not exist."""
    cur = mysql.connection.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS messages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            message TEXT
        )
        """
    )
    mysql.connection.commit()
    cur.close()


@app.route("/health")
def health():
    """Health endpoint used by Docker healthcheck."""
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT 1")
        cur.close()
        return "OK", 200
    except Exception:
        return "DB DOWN", 500


@app.route("/")
def home():
    """Render the main page with all messages."""
    cur = mysql.connection.cursor()
    cur.execute("SELECT message FROM messages")
    messages = cur.fetchall()
    cur.close()
    return render_template("index.html", messages=messages)


@app.route("/submit", methods=["POST"])
def submit():
    """Insert a new message via the form/AJAX."""
    msg = request.form.get("new_message")
    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO messages (message) VALUES (%s)", [msg])
    mysql.connection.commit()
    cur.close()
    return jsonify({"message": msg})


if __name__ == "__main__":
    wait_for_db()
    init_db()
    app.run(host="0.0.0.0", port=5000)
