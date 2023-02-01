
## Troubleshooting
1. 
    - Error: `Can't handle RDB format version 9 \n Fatal error loading the DB: Invalid argument. Exiting.`
    - When: running `yarn dev`
    - Fix: delete `dump.rdb` file in the root directory
2.
    - Error: `ERR unknown command 'push'`
    - When: running `cat redis-scripts/repopulate-queue-test.txt | redis-cli --pipe`
    - Fix: execute `unix2dos <filepath>` to add the correct linebreaks 
3.
    - Error: 
        a) `ERROR 2002 (HY000): Can't connect to local MySQL server through socket '/var/run/mysqld/mysqld.sock'` or 
        b) error connecting: Error: connect ECONNREFUSED 127.0.0.1:3306
             at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1107:14)
             --------------------
             at Protocol._enqueue (../../projects/litmus/lit/node_modules/mysql/lib/protocol/Protocol.js:144:48)
    - When: a) running `mysql` or b) when executing `yarn dev`
    - Fix: Start mysql server by running: `sudo service mysql start`
4.
    - Error: 
        a) `ERR unknown command 'el'`, `ERR unknown command 'push'`
    - When: trying to execute bulk Redis commands from a file
    - Fix: The file needs to be set as CRLF, not LF. Can do this in VSCode in bottom blue footer menu when file is open.

5. 
    - Error: node-gyp errors, like: `node-pre-gyp ERR! node -v v14.9.0 node-pre-gyp ERR! node-pre-gyp -v v0.13.0 node-pre-gyp ERR! not ok`
    - When: running `yarn` in `/client` directory with Node version 12+
    - Fix: install node-gyp globally

6. 
    - Error: `
        ../ext/call.cc: In function ‘bool grpc::node::CreateMetadataArray(v8::Local<v8::Object>, grpc_metadata_array*)’:
        ../ext/call.cc:104:58: error: no matching function for call to ‘v8::Array::Get(unsigned int&)’`
    - When: running `yarn` in `/client` directory with Node version 12+, after installing node-gyp globally
    - Fix: upgraded Firebase from `6.6.2` to `8.0.1`
    - Root cause: seems to be a bug with older gRPC version: https://github.com/grpc/grpc-node/issues/1189