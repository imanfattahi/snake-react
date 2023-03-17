import React from 'react';
import './Item.css'

const Item = (props: any) => {
    return <div className={`item ${props.className}`}>{props.children}</div>;
}

export default Item;