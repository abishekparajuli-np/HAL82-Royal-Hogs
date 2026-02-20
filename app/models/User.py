from datetime import datetime
from app.extensions import db
import bcrypt

class User(db.Model):

    __tablename__ = 'users'

    id=db.Column(db.Integer, primary_key=True)

    username= db.Column(db.String(80),unique=True,nullable=False,index=True)

    email= db.Column(db.String(80),unique=True, nullable=False, index=True)

    password_hash=db.Column(db.String(255),nullable=True)

    role=db.Column(db.String(20),nullable=False,default='user')

    is_active= db.Column(db.Boolean, nullable=False, default=True)

    created_at=db.Column(db.DateTime,nullable=False,default=datetime.utcnow)

    ROLE_USER='user'

    def __repr__(self) -> str:
        return f'<User {self.id}: {self.username}>'
    
    def set_password(self, password: str)-> None:

        password_bytes = password.encode('utf-8')
        salt=bcrypt.gensalt(rounds=12)

        hash_bytes=bcrypt.hashpw(password_bytes,salt)
        self.password_hash=hash_bytes.decode('utf-8') 
    
    def check_password(self, password: str) -> bool:
        if not self.password_hash:
            return False
        
        password_bytes=password.encode('utf-8')
        hash_bytes=self.password_hash.encode('utf-8')

        return bcrypt.checkpw(password_bytes, hash_bytes)
    


    def to_dict(self, include_email: bool = False) -> dict:
        data={
            'id':self.id,
            'username':self.username,
            'role':self.role,
            'is_active':self.is_active,
            'created_at':self.created_at.isoformat() if self.created_at else None,
        }
        if include_email:
            data['email'] = self.email
        
        return data
    
    @classmethod
    def find_by_email(cls, email: str):
        return cls.query.filter(cls.email.ilike(email)).first()
    
    @classmethod
    def find_by_username(cls, username: str):
        return cls.query.filter(cls.username.ilike(username)).first()