import { config } from './config';

type ClientOptions = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  versioned?: boolean;
};

const client = ({
  method,
  body,
  versioned = false,
}: ClientOptions): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();

    req.onreadystatechange = () => {
      if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status >= 200 && req.status < 300) {
          try {
            resolve(JSON.parse(req.responseText));
          } catch {
            resolve(req.responseText);
          }
        } else {
          reject(new Error(`Request failed with status ${req.status}`));
        }
      }
    };

    const url = `https://api.jsonbin.io/v3/b/${config.binId}${
      versioned ? `/${config.binVersion}` : ''
    }`;
    req.open(method, url, true);

    req.setRequestHeader('X-Bin-Meta', 'false');
    if (method !== 'GET') {
      req.setRequestHeader('Content-Type', 'application/json');
    }

    req.setRequestHeader('X-Master-Key', config.apiKey);

    req.send(method !== 'GET' ? JSON.stringify(body) : null);
  });
};

export { client };
