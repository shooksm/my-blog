---
title: Axios Interceptor component for use with React Okta Library
date: "2019-08-03T01:13:29.221Z"
---

One thing I found missing with the [@okta/okta-react](https://www.npmjs.com/package/@okta/okta-react) is handling adding the Bearer token on each request is a very manual task. I use [Axios](https://www.npmjs.com/package/axios) at work and with its ability to intercept requests and responses, it can be used to have a better developer experience.

### Prerequisites

```bash
$ npm i axios react prop-types @okta/okta-react react-router-dom lodash
```

### The SetupAxios component

TLDR, copy the following to get started. I'll break down how it works after the code.

```jsx
import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { withAuth } from '@okta/okta-react';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';

export class UndecoratedSetupAxios extends React.Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    axios: PropTypes.func,
    children: PropTypes.node,
    requestInterceptorHandler: PropTypes.func,
    requestInterceptorErrorHandler: PropTypes.func,
    responseInterceptorSuccessHandler: PropTypes.func,
    responseInterceptorErrorHandler: PropTypes.func,
  };

  static defaultProps = {
    axios,
    children: null,
    requestInterceptorHandler: config => config,
    requestInterceptorErrorHandler: error => Promise.reject(error),
    responseInterceptorSuccessHandler: response => response,
    responseInterceptorErrorHandler: error => Promise.reject(error),
  };

  static displayName = 'SetupAxios';

  requestInterceptor = null;
  responseInterceptor = null;

  componentDidMount() {
    this.requestInterceptor = this.props.axios.interceptors.request.use(
      this.requestInterceptorSuccessHandler,
      this.requestInterceptorErrorHandler
    );
    this.responseInterceptor = this.props.axios.interceptors.response.use(
      this.responseInterceptorSuccessHandler,
      this.responseInterceptorErrorHandler
    );
  }

  componentWillUnmount() {
    this.props.axios.interceptors.request.eject(this.requestInterceptor);
    this.props.axios.interceptors.response.eject(this.responseInterceptor);
  }

  requestInterceptorSuccessHandler = async config => {
    const token = await this.props.auth.getAccessToken();
    // If not able to retrieve a token, send the user back to login
    if (typeof token === 'undefined') {
      this.props.auth.login(
        `${this.props.location.pathname}${this.props.location.search}${
          this.props.location.hash
        }`
      );
      return config;
    }
    // Process the user supplied requestInterceptorHandler
    const newConfig = this.props.requestInterceptorHandler(config);
    // Return the config with the token appended to the Authorization Header
    return {
      ...newConfig,
      headers: {
        ...get(newConfig, 'headers', {}),
        Authorization: `Bearer ${token}`,
      },
    };
  };

  requestInterceptorErrorHandler = error =>
    this.props.requestInterceptorErrorHandler(error);

  responseInterceptorSuccessHandler = response =>
    this.props.responseInterceptorSuccessHandler(response);

  responseInterceptorErrorHandler = error => {
    if (get(error, 'response.status') === 401) {
      this.props.auth.login(
        `${this.props.location.pathname}${this.props.location.search}${
          this.props.location.hash
        }`
      );
    }
    return this.props.responseInterceptorErrorHandler(error);
  };

  render() {
    return this.props.children;
  }
}

export default withRouter(withAuth(UndecoratedSetupAxios));
```

### SetupAxios

Is a component that will wire up Axios interceptors to append the Okta token to every request along with redirecting the user to login when the token expires or requests generate 401 errors.

#### Configuration Properties

* **axios** (optional) - Defaults to the global axios instance but can be used to pass a new axios instance created using `axios.create()` so that more than one Axios instance can be wired up.
* **children** (optional)
* **requestInterceptorHandler** (optional) - Can be used to append additional properties to the Axios config before the request fires off. Defaults to `config => config`.
* **requestInterceptorErrorHandler** (optional) - Can be used to set the request interceptor error handler. Defaults to `error => Promise.reject(error)`.
* **responseInterceptorSuccessHandler** (optional) - Can be used to set the response interceptor success handler. Defaults to `response => response`.
* **responseInterceptorErrorHandler** (optional) - Can be used to add additional actions to the response interceptor error handler after the handler checks for 401 errors. Defaults to `error => Promise.reject(error)`.

### Example usage

```jsx
<Router>
  <Security
    issuer={OKTA_ISSUER}
    client_id={OKTA_CLIENT_ID}
    redirect_uri={`${window.location.origin}/implicit/callback`}
  >
    <SetupAxios>
      <SecureRoute path="/" component={Home} />
      <Route path="/implicit/callback" component={ImplicitCallback} />
    </SetupAxios>
  </Security>
</Router>
```

### How it works

If a unique instance of axios is not passed in, then it will bind the interceptors of the global axios instance. It does this during `componentDidMount`.

The significant piece is the request interceptor. On every Axios request, Okta's auth.getAccessToken method is called to retrieve the current token. It comes back undefined when it is expired and the user is sent to login given the current URL to return back to. When the token is good, it is returned back as part of the Axios configuration's header properties ensuring each request through Axios gets the header.

The other significant piece is the response error interceptor. Whenever there is a unauthorized 401 response the user is sent to login given the current URL to return back to.

This makes using Axios as simple as `axios.post('/v1/some/api')` and the interceptors will automatically handle appending the authorization token to the request and handling any timeout scenarios.

The [SetupAxios component is available as a gist](https://gist.github.com/shooksm/ef77a1600bcb435a7d6d27367d778a98) in case there is any feedback or changes needed.
