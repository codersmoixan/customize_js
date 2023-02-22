const mergeObject = require('../src/对象合并')

const target = {
  header: {
    width: 100,
    height: 100,
    backgroundColor: 'red',
    '& .children': {
      color: 'black',
    },
    '&.focus': {
      height: 88,
      backgroundColor: 'blue',
      '& .children': {
        color: 'white'
      }
    }
  },
  content: {
    display: 'flex',
    width: 500,
    height: 500,
    '& .left': {
      width: 200,
      height: '100%',
      backgroundColor: 'red'
    },
    '& .right': {
      flex: 1,
      height: '100%'
    }
  },
  footer: {
    width: '100%',
    height: 300,
    backgroundColor: 'black'
  }
}

const source = {
  header: {
    backgroundColor: 'yellow',
    '& .children': {
      color: 'blue'
    },
    '&.active': {
      backgroundColor: 'blue'
    }
  },
  content: {
    center: {
      width: 100,
      height: '100%',
      backgroundColor: 'yellow'
    }
  },
  footer: {
    backgroundColor: 'orange'
  }
}

console.log(mergeObject(target, source))
