import Ember from 'ember';
import config from 'open-event-frontend/config/environment';

const { Router, run: { scheduleOnce }, inject: { service } } = Ember;

const router = Router.extend({
  location : config.locationType,
  rootURL  : config.rootURL,
  metrics  : service(),
  session  : service(),

  didTransition() {
    this._super(...arguments);
    this._trackPage();
  },

  _trackPage() {
    scheduleOnce('afterRender', this, () => {
      const page = this.get('url');
      const title = this.getWithDefault('currentRouteName', 'unknown');
      this.get('metrics').trackPage({ page, title });
      this.set('session.currentRouteName', title);
    });
  }
});

router.map(function() {
  this.route('login');
  this.route('register');
  this.route('forgot-password');
  this.route('logout');
  this.route('public', { path: '/e/:event_id' }, function() {
    this.route('sessions');
    this.route('cfs');
    this.route('schedule');
  });
  this.route('create');
  this.route('not-found');
  this.route('not-found-catch', { path: '/*path' });
  this.route('events', function() {
    this.route('view', { path: '/:event_id' }, function() {
      this.route('edit', function() {
        this.route('basic-details');
        this.route('sponsors');
        this.route('sessions-speakers');
      });
    });
  });
});

export default router;
