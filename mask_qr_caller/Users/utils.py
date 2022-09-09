import redis

cache_connection_pool = redis.ConnectionPool(host='redis')

def get_redis_con():
    return redis.Redis(connection_pool=cache_connection_pool)
