Here is a complete cheat sheet of the most commonly used Redis commands in Node.js (ioredis).

To make this easy to digest, the commands are broken down by their Data Type categories so you know exactly when and why to use them.

1. General & Key Management
These commands work on any key, regardless of what type of data (String, Hash, List, etc.) is stored inside it.

Method (ioredis)	Description (One-Line)
redis.exists(key)	Checks if a specific key exists in the database (returns 1 if true, 0 if false).
redis.del(key)	Deletes a key and its associated data permanently from the database.
redis.expire(key, seconds)	Sets a timeout (expiration timer) on a key in seconds.
redis.ttl(key)	Returns the remaining Time-To-Live (in seconds) of an expiring key.
redis.persist(key)	Removes the expiration timer from a key, making it permanent again.
redis.keys(pattern)	Finds all keys matching a specific pattern (e.g., redis.keys('*') gets everything).
redis.flushall()	Deletes absolutely every single key across all databases (use with caution!).

2. Strings (Plain Text / Numbers / JSON Strings)
Strings are the most basic type of value you can store in Redis. They are ideal for basic caching, sessions, and simple counters.

Method (ioredis)	Description (One-Line)
redis.set(key, value)	Stores a basic string or number under a specific key.
redis.get(key)	Retrieves the string value stored at a specific key.
redis.setex(key, seconds, value)	Sets a string value that automatically deletes itself after a given number of seconds.
redis.mget(key1, key2, ...)	Retrieves the values of multiple keys at the same time in a single request.
redis.incr(key)	Increments the integer value of a key by 1 (great for analytics or view counters).
redis.decr(key)	Decrements the integer value of a key by 1.
redis.incrby(key, amount)	Increments the integer value of a key by a specific custom number.

3. Hashes (Objects)
Hashes are perfect for storing structured data like user profiles because they store data as a collection of field-value pairs (exactly like a flat JavaScript Object).

Method (ioredis)	Description (One-Line)
redis.hset(key, field, value)	Sets the value of a specific field inside a hash object.
redis.hget(key, field)	Retrieves the value of a single specific field inside a hash object.
redis.hgetall(key)	Retrieves all fields and values stored within a hash object as a JavaScript object.
redis.hdel(key, field)	Deletes one or more specific fields from a hash object.
redis.hexists(key, field)	Checks if a specific field exists inside a hash object.
redis.hkeys(key)	Retrieves a list of all the field names inside a hash object.


4. Lists (Arrays / Queues)
Redis Lists are ordered collections of strings. They are highly optimized for adding and removing items from the ends, making them ideal for message queues or timeline feeds.

Method (ioredis)	Description (One-Line)
redis.lpush(key, value)	Adds an item to the very beginning (left side) of a list.
redis.rpush(key, value)	Adds an item to the very end (right side) of a list.
redis.lpop(key)	Removes and returns the first item (left side) of a list.
redis.rpop(key)	Removes and returns the last item (right side) of a list.
redis.lrange(key, start, stop)	Retrieves a range of items from a list using index numbers (e.g., 0, -1 gets all items).
redis.llen(key)	Returns the total number of items currently sitting inside a list.

5. Sets (Unique Collections)
Sets are unordered collections of unique strings. If you try to add a duplicate item to a set, Redis will simply ignore it. Great for tracking unique item tags or unique website visitors.

Method (ioredis)	Description (One-Line)
redis.sadd(key, member)	Adds a unique member to a set collection (ignores duplicates).
redis.smembers(key)	Retrieves an array containing all members inside a set.
redis.sismember(key, member)	Checks if a specific value exists as a member of a set (returns 1 if yes, 0 if no).
redis.srem(key, member)	Removes a specific member from a set collection.
redis.scard(key)	Returns the total count of unique elements present inside a set.

6. Sorted Sets (Leaderboards)
Sorted Sets are exactly like regular Sets, but every member is associated with a numeric score. Redis automatically keeps the items sorted by this score. This makes them the ultimate tool for gaming leaderboards or ranking systems.

Method (ioredis)	Description (One-Line)
redis.zadd(key, score, member)	Adds a member with a specific score (or updates their score if they already exist).
redis.zrange(key, start, stop)	Retrieves members sorted from the lowest score to the highest score within a range.
redis.zrevrange(key, start, stop)	Retrieves members sorted from the highest score to the lowest score (ideal for a Top 10 leaderboard).
redis.zscore(key, member)	Retrieves the current numeric score associated with a specific member.
redis.zrevrank(key, member)	Returns the leaderboard rank of a member, sorted from highest score to lowest (0-indexed).
redis.zrem(key, member)	Removes a specific member from the sorted set.