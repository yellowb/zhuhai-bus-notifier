/**
 * A cache includes auto expire feature on cache items.
 * @param ttl the Expiration time of each item, in millisecond
 * @constructor
 */
function DataCache(ttl) {
    this.ttl = ttl;
    this.dataHolder = {};  // Stores key -> value mappings
    this.ttlHolder = {};  // Stores key -> createdTime mappings
}

DataCache.prototype.put = function (key, value) {
    if (_.isEmpty(key)) {
        throw new Error('Can not use empty object as key');
    }
    this.dataHolder[key] = value;
    this.ttlHolder[key] = new Date();
};

DataCache.prototype.get = function (key) {
    if (_.isEmpty(key)) {
        throw new Error('Can not use empty object as key');
    }
    if (_.isUndefined(this.ttlHolder[key])) {
        return null;
    }
    if (new Date() - this.ttlHolder[key] >= this.ttl) {  // if expired, remove it.
        delete this.dataHolder[key];
        delete this.ttlHolder[key];
        return null;
    }
    return this.dataHolder[key];
};

DataCache.prototype.remove = function (key) {
    if (_.isEmpty(key)) {
        throw new Error('Can not use empty object as key');
    }
    delete this.dataHolder[key];
    delete this.ttlHolder[key];
};
