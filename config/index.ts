import app from './app';
import db from './database';
import settings from './settings';
import services from './services';
import cache from './cache';
import mailman from './mailman';
import queue from './queue';

export default [app, db, settings, services, cache, mailman, queue];
