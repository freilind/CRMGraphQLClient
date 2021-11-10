import React, {useEffect} from 'react';
import Layout from '../components/Layout';
import {
    BarChart, Bar,  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
  } from 'recharts';
import { gql, useQuery } from '@apollo/client';

const TOP_CLIENTS = gql`
    query Query {
        topClients {
            total
            client {
                id
                name
                lastname
                email
            }
        }
    }
`;

const TopClients = () => {

    const {data, loading, error, startPolling, stopPolling} = useQuery(TOP_CLIENTS);
    useEffect(() => {
        startPolling(1000);
        return () => {
            stopPolling();
        }
    }, [startPolling, stopPolling]);

    if(loading) return 'Loading...';
    
    const {topClients} = data;
    const clientGraph = [];

    topClients.map((client, index) => {
        clientGraph[index] = {
            ...client.client[0],
            total: client.total
        }
    });

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Top Clients</h1>

            <ResponsiveContainer
                width={'99%'}
                height={550}
            >
                <BarChart
                    className="mt-10"
                    width={600}
                    height={500}
                    data={clientGraph}
                    margin={{
                        top: 5, right: 30, left: 20, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#3182CE" />
                </BarChart>
            </ResponsiveContainer>
        </Layout>
    );
};

export default TopClients;


