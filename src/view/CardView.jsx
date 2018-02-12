import React, { Component } from 'react';

const Card = ({
    id,
    name,
    age,
    sex
}) => (
    <tr>
        <td>{id}</td>
        <td>{name}</td>
        <td>{age}</td>
        <td>{sex}</td>
    </tr>
)

const CardList = ({ users, loading }) => (
    <table 
        className={`dot table ${loading ? 'loading' : ''}`}
    >
        <thead>
            <tr>
                <th>id</th>
                <th>name</th>
                <th>age</th>
                <th>sex</th>
            </tr>
        </thead>
        <tbody>
            {
                users.map(item => <Card key={item.id} {...item} />)
            }
        </tbody>
    </table>
)

export {
    Card,
    CardList,
}