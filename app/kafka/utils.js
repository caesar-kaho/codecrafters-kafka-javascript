export const toBufferFromInt8 = (value) => Buffer.from([value]);

export const toBufferFromInt16BE = (value) => {
    const buf = Buffer.alloc(2);
    buf.writeInt16BE(value);
    return buf;
};

export const toBufferFromInt32BE = (value) => {
    const buf = Buffer.alloc(4);
    buf.writeInt32BE(value);
    return buf;
};

export const NULL_TAG = Buffer.from([0]);