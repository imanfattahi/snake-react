import React from 'react';

const Record = (props: {feed : number, rows: number, columns: number, enemies: number}) => {
    return (<div className='record'>
        <p>
            <strong>Eaten:</strong>
            <small>{ props.feed }</small>
        </p>
        <p>
            <strong>Row:</strong>
            <small>{ props.rows }</small>
        </p>
        <p>
            <strong>Column:</strong>
            <small>{ props.columns }</small>
        </p>
        <p>
            <strong>Enemy:</strong>
            <small>{ props.enemies }</small>
        </p>
    </div>);
}

export default Record;