import setText, { appendText, showWaiting, hideWaiting } from './results.mjs';

export function get() {
    axios.get('http://localhost:3000/orders/1').then(({ data }) => {
        setText(JSON.stringify(data));
    });
}

export function getCatch() {
    axios
        .get('http://localhost:3000/orders/123')
        .then((results) => {
            if (results.status == '200') {
                setText(JSON.stringify(results.data));
            } else {
                setText('error');
            }
        })
        .catch((e) => setText(e));
}

export function chain() {
    axios
        .get('http://localhost:3000/orders/1')
        .then(({ data }) => {
            return axios.get('http://localhost:3000/addresses/' + data.shippingAddress);
        })
        .then(({ data }) => {
            setText(JSON.stringify(data));
        });
}

export function chainCatch() {
    axios
        .get('http://localhost:3000/orders/1')
        .then(({ data }) => {
             return axios.get('http://localhost:3000/addresses/' + data.shippingAddress);
             throw new Error('test');
        })
        .catch(err=>setText(err))
        .then(({ data }) => {
            setText(JSON.stringify(data.my.city));

        }).catch(err=>setText(err));
}

export function final() {
    showWaiting();
    axios
        .get('http://localhost:3000/orders/1')
        .then(({ data }) => {
            return axios.get('http://localhost:3000/addresses/' + data.shippingAddress);
        })
        .then(({ data }) => {
            setText(JSON.stringify(data));
        }).finally(()=>{
            hideWaiting();
        });
}
