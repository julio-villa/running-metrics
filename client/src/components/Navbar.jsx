import React, { useState } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { firebaseSignOut } from '../utilities/firebase';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const CustomNavbar = () => {
    let navigate = useNavigate();
    const [expanded, setExpanded] = useState(false);

    const handleSignOut = async () => {
        await firebaseSignOut();
        navigate('/');
        setExpanded(false); 
    }

    const collapseNavbar = () => {
        setExpanded(false);
    }

    return (
        <Navbar className='navbar' bg="dark" variant="dark" expand="lg" fixed="top" expanded={expanded}>
            <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(expanded ? false : true)} />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto" onClick={collapseNavbar}>
                    <LinkContainer to="/logrun">
                        <Nav.Link> Log Run</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/stats">
                        <Nav.Link>Stats</Nav.Link>
                    </LinkContainer>
                </Nav>
                <Nav.Link onClick={handleSignOut} className="ml-auto" id="sign-out">Sign Out</Nav.Link>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default CustomNavbar;
