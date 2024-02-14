import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Input from '@material-ui/core/Input';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AmeyoLogger from 'packages/ameyo-logger';
import { useDispatch, useSelector } from 'react-redux';
import { setOrders, addOrder, deleteOrder, editOrder } from '../../../../store/orderSli';
import { Order } from '../../../../store/orderSli'; // Adjust the path based on your actual file structure


const API = "https://jsonplaceholder.typicode.com/users";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			'& > *': {
				margin: theme.spacing(1),
			},
		},
		table: {
			minWidth: 650,
		},
		searchInput: {
			margin: theme.spacing(2),
		},
		deleteButton: {
			color: 'white',
			backgroundColor: 'red',
			marginRight: theme.spacing(1),
		},
		editButton: {
			textDecoration: 'none',
			marginRight: theme.spacing(1),
		},
		addButton: {
			textDecoration: 'none',
			marginRight: theme.spacing(1),
		},
	})
);

function Orders() {
	const classes = useStyles();
	const dispatch = useDispatch();
	const orders = useSelector((state: { orders: Order[] }) => state.orders);
	const [searchTerm, setSearchTerm] = useState('');
	const [openAddDialog, setOpenAddDialog] = useState(false);
	const [newOrderName, setNewOrderName] = useState('');
	const [newOrderEmail, setNewOrderEmail] = useState('');
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [editedOrderId, setEditedOrderId] = useState<number | null>(null);
	const [editedOrderName, setEditedOrderName] = useState('');
	const [editedOrderEmail, setEditedOrderEmail] = useState('');
	const { t } = useTranslation();

	useEffect(() => {
		AmeyoLogger.info('Orders.js', 'Orders component loaded');
		fetch(API)
			.then((response) => response.json())
			.then((data) => dispatch(setOrders(data)));
	}, [dispatch]);

	const handleDelete = (userId: number) => {
		dispatch(deleteOrder(userId));
	};

	const handleAdd = () => {
		const newOrder = {
			id: orders.length + 1,
			name: newOrderName,
			email: newOrderEmail,
		};
		dispatch(addOrder(newOrder));
		setOpenAddDialog(false);
		setNewOrderName('');
		setNewOrderEmail('');
	};

	const handleEdit = (userId: number) => {
		const selectedOrder = orders.find((order) => order.id === userId);
		setEditedOrderId(userId);
		setEditedOrderName(selectedOrder?.name || '');
		setEditedOrderEmail(selectedOrder?.email || '');
		setOpenEditDialog(true);
	};

	const handleSaveChanges = () => {
		dispatch(
			editOrder({
				id: editedOrderId || 0,
				updatedOrder: { name: editedOrderName, email: editedOrderEmail },
			})
		);
		setOpenEditDialog(false);
		setEditedOrderId(null);
		setEditedOrderName('');
		setEditedOrderEmail('');
	};

	const filteredData = orders?.filter((order) =>
		order.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div>
			<h1>{t('Orders')}</h1>

			<Input
				className={classes.searchInput}
				placeholder="Search by name..."
				onChange={(e) => setSearchTerm(e.target.value)}
			/>

			<Button
				variant="contained"
				color="primary"
				className={classes.addButton}
				onClick={() => setOpenAddDialog(true)}
			>
				Add
			</Button>
			<Table className={classes.table}>
				<TableHead>
					<TableRow>
						<TableCell>ID</TableCell>
						<TableCell>Name</TableCell>
						<TableCell>Email</TableCell>
						<TableCell>Actions</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{filteredData.map((user) => (
						<TableRow key={user.id}>
							<TableCell>
								<Link to={`/order/${user.id}`}>{user.id}</Link>
							</TableCell>
							<TableCell>
								<Link to={`/order/${user.id}`}>{user.name}</Link>
							</TableCell>
							<TableCell>
								<Link to={`/order/${user.id}`}>{user.email}</Link>
							</TableCell>
							<TableCell>
								<Button
									className={classes.deleteButton}
									onClick={() => handleDelete(user.id)}
								>
									Delete
								</Button>
								<Button
									className={classes.editButton}
									onClick={() => handleEdit(user.id)}
								>
									Edit
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<Dialog
				open={openAddDialog}
				onClose={() => setOpenAddDialog(false)}
				aria-labelledby="form-dialog-title"
			>
				<DialogTitle id="form-dialog-title">Add New Order</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Please enter the details for the new order.
					</DialogContentText>
					<TextField
						autoFocus
						margin="dense"
						label="Name"
						type="text"
						fullWidth
						value={newOrderName}
						onChange={(e) => setNewOrderName(e.target.value)}
					/>
					<TextField
						margin="dense"
						label="Email"
						type="email"
						fullWidth
						value={newOrderEmail}
						onChange={(e) => setNewOrderEmail(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenAddDialog(false)} color="primary">
						Cancel
					</Button>
					<Button onClick={handleAdd} color="primary">
						Add
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={openEditDialog}
				onClose={() => setOpenEditDialog(false)}
				aria-labelledby="form-dialog-title"
			>
				<DialogTitle id="form-dialog-title">Edit Order</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Please update the details for the selected order.
					</DialogContentText>
					<TextField
						autoFocus
						margin="dense"
						label="Name"
						type="text"
						fullWidth
						value={editedOrderName}
						onChange={(e) => setEditedOrderName(e.target.value)}
					/>
					<TextField
						margin="dense"
						label="Email"
						type="email"
						fullWidth
						value={editedOrderEmail}
						onChange={(e) => setEditedOrderEmail(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenEditDialog(false)} color="primary">
						Cancel
					</Button>
					<Button onClick={handleSaveChanges} color="primary">
						Save Changes
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default Orders;
