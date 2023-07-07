import React, { useEffect, useState } from 'react';
import NavBar from '../NavBar';
import handWaving from '../../assets/hand-waving.svg';
import FavoriteFoodItem from '../FavoriteFoodItem';
import api from '../../api/api';
import apiBaseURL from '../../api/apiBaseURL';

class Profile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			email: '',
			address: '',
			password: '',
			image: null,
			previewImage: null,
			getProfileResponse: null,
			postProfileResponse: null,
			favoriteResponse: null,
			editMode: false,
		};

		this.onNameChangeEventHandler = this.onNameChangeEventHandler.bind(this);
		this.onEmailChangeEventHandler = this.onEmailChangeEventHandler.bind(this);
		this.onAddressChangeEventHandler =
			this.onAddressChangeEventHandler.bind(this);
		this.onPasswordChangeEventHandler =
			this.onPasswordChangeEventHandler.bind(this);
		this.toggleEditMode = this.toggleEditMode.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleImage = this.handleImage.bind(this);
	}

	onNameChangeEventHandler(event) {
		this.setState(() => {
			return {
				name: event.target.value,
			};
		});
	}

	onEmailChangeEventHandler(event) {
		this.setState(() => {
			return {
				email: event.target.value,
			};
		});
	}

	onAddressChangeEventHandler(event) {
		this.setState(() => {
			return {
				address: event.target.value,
			};
		});
	}

	onPasswordChangeEventHandler(event) {
		this.setState(() => {
			return {
				password: event.target.value,
			};
		});
	}

	toggleEditMode(event) {
		event.preventDefault();
		this.setState(() => {
			return {
				editMode: !this.state.editMode,
			};
		});
		event.stopPropagation();
	}

	handleImage(event) {
		console.log(event.target.files);
		this.setState(() => {
			return {
				image: event.target.files[0],
				previewImage: URL.createObjectURL(event.target.files[0]),
			};
		});
	}

	async componentDidMount() {
		const getProfileResponse = await api.get(
			`user/${localStorage.getItem('user_id')}`
		);
		const favoriteResponse = await api.get(
			`favourite-user/${localStorage.getItem('user_id')}`
		);

		this.setState({ getProfileResponse: getProfileResponse.data });
		this.setState({ favoriteResponse: favoriteResponse.data });

		console.log(this.state.getProfileResponse);
	}

	async handleSubmit(event) {
		const formData = new FormData();
		formData.append('name', this.state.name);
		formData.append('email', this.state.email);
		formData.append('address', this.state.address);
		formData.append('password', this.state.password);
		formData.append('file', this.state.image);

		// const updateProfile = {
		// 	name: this.state.name,
		// 	email: this.state.email,
		// 	address: this.state.address,
		// 	password: this.state.password,
		// 	file: formData,
		// };

		const postProfileResponse = await api.post(`user?_method=PUT`, formData, {
			headers: {
				'Accept': 'multipart/form-data, application/json',
				// 'Content-Type': 'multipart/form-data',
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		});

		
		this.setState(() => {
			return {
				postProfileResponse: postProfileResponse.data,
			};
		});

		console.log(formData);
	}

	render() {
		return (
			<div>
				<NavBar />
				<div className="flex mb-8">
					<div className="w-1/3 px-16">
						{this.state.getProfileResponse && (
							<>
								<div className="flex space-x-2">
									<p>
										<span className="font-semibold">Hi</span>,{' '}
										{this.state.getProfileResponse.data.name}
									</p>
									<img src={handWaving} alt="hand-waving" className="w-6 h-6" />
								</div>
								<img
									src={
										this.state.previewImage
											? this.state.previewImage
											: `${apiBaseURL}storage/image/${this.state.getProfileResponse.data.avatar}`
									}
									alt="profile"
									className="w-full my-12 rounded-lg"
								/>
								<form
									onSubmit={this.handleSubmit}
									className="space-y-4"
									// encType="multipart/form-data"
								>
									{this.state.editMode ? (
										<label>
											<input
												type="file"
												name="file"
												onChange={(event) => this.handleImage(event)}
												className="file:transition file:bg-GF-green file:hover:bg-opacity-75
                                                 file:border-none file:rounded-xl file:text-white file:py-2 file:px-4 file:hover:cursor-pointer"
											/>
										</label>
									) : null}
									<label className="font-medium flex flex-col">
										Name
										<input
											type="text"
											name="name"
											value={
												!this.state.editMode
													? this.state.getProfileResponse.data.name
													: this.state.name
											}
											onChange={this.onNameChangeEventHandler}
											disabled={!this.state.editMode}
											className="font-light border-b-2 border-black bg-transparent outline-none"
										/>
									</label>
									<label className="font-medium flex flex-col">
										Email
										<input
											type="email"
											name="email"
											value={
												!this.state.editMode
													? this.state.getProfileResponse.data.email
													: this.state.email
											}
											onChange={this.onEmailChangeEventHandler}
											disabled={!this.state.editMode}
											className="font-light border-b-2 border-black bg-transparent outline-none"
										/>
									</label>
									<label className="font-medium flex flex-col">
										Address
										<input
											type="text"
											name="address"
											value={
												!this.state.editMode
													? this.state.getProfileResponse.data.address
													: this.state.address
											}
											onChange={this.onAddressChangeEventHandler}
											disabled={!this.state.editMode}
											className="font-light border-b-2 border-black bg-transparent outline-none"
										/>
									</label>
									<label className="font-medium flex flex-col">
										Password
										<input
											type="password"
											name="password"
											value={
												!this.state.editMode ? '********' : this.state.password
											}
											onChange={this.onPasswordChangeEventHandler}
											disabled={!this.state.editMode}
											className="font-light border-b-2 border-black bg-transparent outline-none"
										/>
									</label>
									{this.state.editMode ? (
										<div className="flex space-x-2">
											<button
												type="submit"
												className="bg-GF-green w-full py-4 rounded-xl font-medium text-white"
											>
												Simpan profil
											</button>
											<button
												onClick={this.toggleEditMode}
												className="bg-red-500 px-5 rounded-xl font-medium text-white text-lg"
											>
												&times;
											</button>
										</div>
									) : (
										<button
											onClick={this.toggleEditMode}
											className="bg-GF-green w-full py-4 rounded-xl font-medium text-white"
										>
											Edit profil
										</button>
									)}
								</form>
							</>
						)}
					</div>
					<div className="w-2/3 px-16">
						<p className="text-GF-grey font-semibold mb-12">Makanan Favorit</p>
						<div className="grid grid-cols-3 gap-10">
							{this.state.favoriteResponse && (
								<>
									{this.state.favoriteResponse.data.length !== 0 ? (
										this.state.favoriteResponse.data.map((item) => (
											<FavoriteFoodItem
												key={item.food_id}
												name={item.foodname}
												image={item.image}
											/>
										))
									) : (
										<div className="col-span-3 h-96 flex justify-center items-center">
											<p className="text-xl font-bold">
												Belum ada makanan favoritmu nih
											</p>
										</div>
									)}
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Profile;
