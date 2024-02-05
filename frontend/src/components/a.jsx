import React from 'react';
import {Box,Typography } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';


const CategoryCard = ({ image }) => {
    const useStyles = makeStyles({
        demowrap:{
            position:'relative'
        },
        '&::before':{
            content: '"',
            display: 'block',
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            opacity: 0.6,
            backgroundImage: `url(${image})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '50% 0',
            backgroundSize: 'cover'
        },

        demoContent:{
            position:'relative'
        }
    })

    const useStyles = makeStyles({
        demowrap:{
            position:'relative',
            '&:before':{
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0.6,
                  backgroundImage: `url(${image})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: '50% 0',
                  backgroundSize: 'cover'
            }
        },
        demoContent:{
            position:'relative'
        }
    })
  

    const classes = useStyles()
    return (
        <Box component="div" className={classes.demowrap}>
            <Box  component="div" className={classes.demoContent} > 
                <Typography component="p">Hello</Typography> 
            </Box>
        </Box>
    );
};

export default CategoryCard;