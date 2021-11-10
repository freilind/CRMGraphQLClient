import React, {useEffect} from 'react';
import Layout from '../components/Layout';
import {
    BarChart, Bar,  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
  } from 'recharts';
import { gql, useQuery } from '@apollo/client';

const TOP_SELLERS = gql`
    query Query {
        topSellers {
            total
            seller {
                name
                lastname
                email
            }
        }
    }
`;

const TopSellers = () => {

    const {data, loading, error, startPolling, stopPolling} = useQuery(TOP_SELLERS);
    useEffect(() => {
        startPolling(1000);
        return () => {
            stopPolling();
        }
    }, [startPolling, stopPolling]);

    if(loading) return 'Loading...';
    
    const {topSellers} = data;
    const sellerGraph = [];

    topSellers.map((seller, index) => {
        sellerGraph[index] = {
            ...seller.seller[0],
            total: seller.total
        }
    });

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Top Sellers</h1>

            <ResponsiveContainer
                width={'99%'}
                height={550}
            >
                <BarChart
                    className="mt-10"
                    width={600}
                    height={500}
                    data={sellerGraph}
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

export default TopSellers;

