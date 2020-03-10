export default {
    render(createElement) {
        return createElement('div', {
            'class': {
                foo: true,
                bar: false
            },
            style: {
                color: 'red',
                fontSize: '14px'
            },
            attrs: {
                id: 'boo',
            },
            domProps: {
                innerHTML: 'Hello Vue!'
            }
        })
    }
}
