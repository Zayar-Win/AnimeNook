import React from 'react'
import ReactStars from 'react-rating-stars-component';
const Rating = ({size=32,ratingHandler}) => {
    const ratingChanged = (rating) => {
        ratingHandler(rating)
    }
    return (
        <ReactStars
            count={5}
            onChange={ratingChanged}
            size={size}
            activeColor="#ffd700"
        />
    )
}

export default Rating