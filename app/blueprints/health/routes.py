from flask import jsonify, current_app
from datetime import datetime

from app.extensions import db
from app.blueprints.health  import health_bp

@health_bp.route('/health',methods=['GET'])
def health_check():
    return jsonify({
        'status':'healthy',
        'timestamp':datetime.utcnow().isoformat(),
        'service':'ratna-forum',
        'version':'1.0.0.0'
    }),200

@health_bp.route('/health/ready',methods=['GET'])
def readiness_check():
    checks={}
    all_healthy=True
    db_check=_check_database()
    checks['database']= db_check
    if db_check['status'] != 'healthy':
        all_healthy=False

    redis_check=_check_redis()
    checks['redis']= redis_check
    if redis_check['status'] != 'healthy':
        all_healthy=False
    
    status_code = 200 if all_healthy else 503
    status= 'ready' if all_healthy else 'not_ready'

    return jsonify({
        'status':status,
        'timestamp':datetime.utcnow().isoformat(),
        'checks':checks
    }), status_code


def _check_database() -> dict:
    import time
    from sqlalchemy import text

    try:
        start =time.perf_counter()

        db.session.execute(text('SELECT 1'))

        latency_ms =(time.perf_counter() - start) *1000

        return{
            'status':'healthy',
            'latency_ms': round(latency_ms, 2)
        }
    except Exception as e:
        current_app.logger.error('DataBase Health Check Failed: {}'.format(e))
        return {
            'status':'unhealthy',
            'error':str(e)
        }
def _check_redis() -> dict:
    import time

    redis_client= current_app.extensions.get('redis')

    if redis_client is None:
        return{
            'status':'unhealthy',
            'error':'Redis CLient is not initialized'
        }
    
    try:
        start= time.perf_counter()

        redis_client.ping()

        latency_ms= (time.perf_counter()-start)*1000

        return{
            'status':'healthy',
            'latency_ms': round(latency_ms,2)
        }
    except Exception as e:
        current_app.logger.error('Redis health check failed: {}'. format(e))
        return{
            'status':'unhealthy',
            'error': str(e)
        }