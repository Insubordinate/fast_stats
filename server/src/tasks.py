from celery import shared_task


@shared_task(ignore_result=False,name='tasks.add')
def add(a: int, b: int) -> int:
    return a + b
