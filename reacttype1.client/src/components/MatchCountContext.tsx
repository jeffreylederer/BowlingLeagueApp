import { createContext } from 'react';

// set the defaults
const MatchCountContext = createContext({
    Count: 0,
    setCount: () => { }
});

export default MatchCountContext;