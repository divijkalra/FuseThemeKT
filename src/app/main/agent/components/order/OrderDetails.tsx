import React from 'react';
import { useParams } from 'react-router-dom';
import { makeStyles, Theme } from '@material-ui/core/styles';

interface Params {
    orderId: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    orderDetailsContainer: {
        padding: theme.spacing(4),
        border: '2px solid #ddd',
        borderRadius: theme.spacing(2),
        maxWidth: 600,
        margin: 'auto',
        textAlign: 'center',
    },
    orderIdText: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: theme.spacing(2),
    },
}));

function OrderDetails() {
    const classes = useStyles();
    const { orderId } = useParams < Params > ();

    return (
        <div className={classes.orderDetailsContainer}>
            <h2>Order Details</h2>
            <p className={classes.orderIdText}>
                This is the order details page for Order ID: {orderId}
            </p>
        </div>
    );
}

export default OrderDetails;
