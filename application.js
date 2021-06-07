const isGeneratorFunction = require('is-generator-function');
const Emitter  = require('events');
const context = require('./context');
const request = require('./request');
const statuses = require('statuses');
const util = require('util');
const Stream = require('stream');
const http = require('http');
const only = require('only');
const response = require('./response');
const convert = require('koa-convert');
const deprecate = require('depd')('koa');
const { HttpError } = require('http-errors');

/* 
  实现Koa类的功能，先实现创建服务的功能，
  1. listen方法创建一个http服务并监听一个端口服务
  2. use方法把回调传入
*/
class Koa extends Emitter {
	constructor(options) {
		super(); // call parent class constructor
    options = options || {};
    this.proxy = options.proxy || false;

    this.middleware = []; // 中间件队列
    this.context = Object.create(context);
    this.request = Object.create(request);
    this.response = Object.create(response);
    // util.inspect.custom support for node 6+
    /* istanbul ignore else */
    if (util.inspect.custom) {
      this[util.inspect.custom] = this.inspect;
    }
	}
	use(fn) {}
  /**
   *  Shorthand for:
   *    http.createServer(app.callback()).listen(...)
   * @param  {Mixed} args 
   * @return {Server}
   * @api public
   */
	listen(...args) {
    // debug()
    const server = http.createServer(this.callback())
    return server.listen(...args)
  }
}

module.exports = Koa