import React, { useReducer } from 'react'
import { useContext } from 'react'
import { Helmet } from 'react-helmet-async'
import { Store } from '../Store'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { getError } from '../utils'
import axios from 'axios'
import LoadingBox from '../components/LoadingBox'


function reducer(state, action) {
    switch (action.type) {
        case 'UPDATE_REQUEST':
            return { ...state, loadingUpdate: true }
        case 'UPDATE_SUCCESS':
            return { ...state, loadingUpdate: false }
        case 'UPDATE_FAIL':
            return { ...state, loadingUpdate: false }
        default:
            return state
    }
}

export default function ProfileScreen() {
    const { state, dispatch: ctxDispatch } = useContext(Store)
    const { userInfo } = state;

    const [{ loadingUpdate }, dispatch] = useReducer(reducer, { loadingUpdate: false })

    const [name, setName] = useState(userInfo.name)
    const [email, setEmail] = useState(userInfo.email)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const submitHandler = async (e) => {
        e.preventDefault();
        
        dispatch({ type: 'UPDATE_REQUEST' })
        try {
            const { data } = await axios.put('api/users/profile',
                {
                    name,
                    email,
                    password,
                },
                {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                  })
            dispatch({ type: 'UPDATE_SUCCESS' })
            console.log("data:", data)

            ctxDispatch({ type: 'USER_SIGNIN', payload: data })

            localStorage.setItem('userInfo', JSON.stringify(data))
            toast.success('User Updated Successfully')
        }
        catch (err) {
            dispatch({ type: 'UPDATE_FAIL' })
            toast.error(getError(err))
        }
    }

    return (
        <div className="container small-container">
            <Helmet>
                <title>Profile Screen</title>
            </Helmet>
            <h1 className="my-3">User Profile</h1>
            {loadingUpdate ? <LoadingBox></LoadingBox> : <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" value={name} onChange={(e) => { setName(e.target.value) }} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" value={email} onChange={(e) => { setEmail(e.target.value) }} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="confirmPassword">
                    <Form.Label>ConfirmPassword</Form.Label>
                    <Form.Control type="password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value) }} />
                </Form.Group>
                <div className="mb-3">
                    <Button type="submit" variant="warning">Update</Button>
                </div>
            </Form>
            }

        </div>
    )
}
