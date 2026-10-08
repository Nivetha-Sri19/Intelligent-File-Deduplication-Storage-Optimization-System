from app.workers.celery_app import celery_app
@celery_app.task
def health_task(): return {'status':'ok'}
