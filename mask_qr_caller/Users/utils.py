import redis

cache_connection_pool = redis.ConnectionPool(host='redis')

def get_redis_con():
    return redis.StrictRedis(connection_pool=cache_connection_pool)


def handle_count(user, key):
    if not user:
        return
    if key == "scanned":
        user.scan_count += 1
        user.save()
    if key == "called":
        user.called_count += 1
        user.save()