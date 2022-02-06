import setText, { appendText } from './results.mjs';

export function timeout() {
    const wait = new Promise((res, rej) => {
        debugger;
        setTimeout(() => {
            res('timeout');
        }, 1500);
    });
    wait.then(setText);
}

export function interval() {
    const interval = new Promise((res, rej) => {
        setInterval(() => {
            res('Interval');
        }, 1500);
    });
    interval.then(setText);
}

export function clearIntervalChain() {
    let intV;
    const interval = new Promise((res, rej) => {
        intV = setInterval(() => {
            res('Interval');
        }, 1500);
    });
    interval.then(setText).finally(() => clearInterval(intV));
}

export function xhr() {
    let req = new Promise((res, rej) => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:3000/users/7');
        xhr.onload = () => {
            if (xhr.status == 200) {
                res(xhr.responseText);
            } else {
                rej('Failed to find');
            }
        };
        xhr.onerror = (err) => rej(err);
        xhr.send();
    });
    req.then(setText).catch(setText);
}

export function allPromises() {
    let categories = axios.get('http://localhost:3000/itemCategories');
    let statuses = axios.get('http://localhost:3000/orderStatuses');
    let userTypes = axios.get('http://localhost:3000/userTypes');
    let address = axios.get('http://localhost:3000/addressTypes');
    Promise.all([ categories, statuses, userTypes, address ]).then(([ cat, status, user, adderss ]) => {
        setText('');
        appendText(JSON.stringify(cat.data));
        appendText(JSON.stringify(status.data));
        appendText(JSON.stringify(user.data));
        appendText(JSON.stringify(adderss.data));
    }).catch(err=>setText(err));
}

export function allSettled() {
    let categories = axios.get("http://localhost:3000/itemCategories");
  let statuses = axios.get("http://localhost:3000/orderStatuses");
  let userTypes = axios.get("http://localhost:3000/userTypes");
  let address = axios.get("http://localhost:3000/addressTypes");

  Promise.allSettled([categories, statuses, userTypes, address])
    .then(values => {
      let results = values.map(v => {
        if (v.status === "fulfilled") {
          return `FULFILLED: ${JSON.stringify(v.value.data[0])}`;
        }

        return `REJECTED: ${v.reason.message}`;
      });

      setText(results);
    })
    .catch(reasons => {
      setText(reasons);
    });
}

export function race() {
    let users = axios.get("http://localhost:3000/users");
  let backupUsers = axios.get("http://localhost:3001/users");
  Promise.race([users, backupUsers])
    .then(users => setText(JSON.stringify(users.data)))
    .catch(reason => setText(reason));
}
