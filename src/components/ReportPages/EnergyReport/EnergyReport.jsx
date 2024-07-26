import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Container, Box, Button, Grid, ListItemDecorator } from '@mui/joy';
import Card from '@mui/joy/Card';
import Typography from '@mui/joy/Typography';
import { DateTime } from 'luxon';
import './EnergyReport.css';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import ReportEquipmentCard from '../ReportEquipmentCard/ReportEquipmentCard';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import EquipmentForm from '../../Assessment/EqupmentForm';
import ClearIcon from '@mui/icons-material/Clear';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default function EnergyReport() {
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams();
  const user = useSelector((store) => store.user);
  const reportDetails = useSelector((store) => store.reports.reportDetails);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch({ type: 'FETCH_REPORT_DETAILS', payload: params.id });
  }, []);

  const approveReport = (reportId) => {
    const timeApproved = DateTime.now().setLocale('zh').toLocaleString();
    dispatch({
      type: 'APPROVE_REPORT',
      payload: { reportId, approvedAt: timeApproved },
    });
  };

  const navReports = () => {
    if (user.admin === true) {
      history.push('/admin-reports');
    } else {
      history.push('/user-reports');
    }
  };

  // edit notes
  const [editNotesToggle, setEditNotesToggle] = useState(false);

  const submitNotes = () => {
    dispatch({
      type: 'UPDATE_NOTES',
      payload: { reportId: reportDetails.id, notes: reportDetails.notes },
    });
    setEditNotesToggle(!editNotesToggle);
  };

  // delete recommendations
  const [deleteRecsToggle, setDeleteRecsToggle] = useState(false);

  const deleteRecommendation = (recommendationId) => {
    console.log('in submitRecommendations, check rec id', recommendationId);
    console.log('in submitRecommendations, check params id', params.id);
    dispatch({ type: 'DELETE_RECOMMENDATION', payload: { recommendationId, reportId: params.id } });
  };

  // add recommendation
  const [addRecToggle, setAddRecToggle] = useState(false);

  let [newRec, setNewRec] = useState({
    recommendations: '',
  });

  const handleNewRec = (event) => {
    event.preventDefault();
    setNewRec(event.target.value);
    console.log('check new rec', newRec);
  };

  const submitRec = (event) => {
    console.log('in submitRec, check params.id', params.id);
    event.preventDefault();
    console.log('check newrec', newRec.recommendations);
    if (newRec.recommendations === '') {
      return;
    } else {
      dispatch({ type: 'ADD_RECOMMENDATION', payload: { recommendations: newRec, reportId: params.id } });
    }
  };

  return (
    <Box sx={{ flex: 1 }}>
      <h1 className='energy-report-header'>{reportDetails.name} Energy Report</h1>
      <Grid container sx={{ justifyContent: 'space-between', mx: 6, mt: 3 }}>
        <Button
          onClick={navReports}
          sx={{
            backgroundColor: '#008242',
            width: '12vw',
            '&:hover': {
              backgroundColor: '#00341a',
            },
          }}
        >
          Back to all Reports
        </Button>
        {user.admin ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {!reportDetails.approved ? (
              <Button
                onClick={() => approveReport(reportDetails.id)}
                sx={{
                  backgroundColor: '#008242',
                  '&:hover': {
                    backgroundColor: '#00341a',
                  },
                }}
              >
                Approve
              </Button>
            ) : (
              <Typography sx={{ alignContent: 'center' }}>
                Approved by: {reportDetails.username} on {DateTime.now().toLocaleString(reportDetails.approvedAt)}
              </Typography>
            )}
          </Box>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {reportDetails.approved ? (
              <Typography sx={{ alignContent: 'center' }}>
                Approved by: {reportDetails.username} on {DateTime.now().toLocaleString(reportDetails.approvedAt)}
              </Typography>
            ) : (
              <Typography sx={{ alignContent: 'center' }}>Pending Approval by RJ Energy</Typography>
            )}
          </Box>
        )}
      </Grid>
      <Box className='container'>
        <Box
          className='card-container'
          sx={{
            minHeight: 75,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 0,
          }}
        >
          <Card
            className='container-card'
            variant='outlined'
            sx={(theme) => ({
              width: 300,
              height: 200,
              flexDirection: 'column',
              overflow: 'hidden',
              transition: 'transform 0.3s, border 0.3s',
              border: '1px solid #1F1C4C',
              '&:hover': {
                borderColor: theme.vars.palette.primary.outlinedHoverBorder,
                transform: 'translateY(-2px)',
              },
            })}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <div>
                <Typography level='title-lg'>Date Submitted: </Typography>
                <Typography level='body-sm'>
                  {DateTime.fromISO(reportDetails.date_submitted).toFormat('MMMM dd, yyyy')}
                </Typography>
                <Typography level='title-lg'>Location Address:</Typography>
                <Typography level='body-sm'>{reportDetails.address}</Typography>
                <Typography level='title-lg'>Report Status:</Typography>
                <Typography level='body-sm'>
                  {reportDetails.approved ? <td>Approved</td> : <td>Pending Approval</td>}
                </Typography>
              </div>
            </Box>
          </Card>
          <Card
            className='container-card'
            variant='outlined'
            sx={(theme) => ({
              width: 300,
              height: 200,
              flexDirection: 'column',
              overflow: 'hidden',
              transition: 'transform 0.3s, border 0.3s',
              border: '1px solid #1F1C4C',
              '&:hover': {
                borderColor: theme.vars.palette.primary.outlinedHoverBorder,
                transform: 'translateY(-2px)',
              },
            })}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography level='title-lg'>Annual Carbon Footprint</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography level='body-sm'>
                {reportDetails?.equipment?.reduce((sum, item) => sum + Number(item.carbon_footprint), 0).toFixed(3)}{' '}
                Tons/year
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography level='title-lg'>Annual Energy Cost</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography level='body-sm'>
                $
                {(reportDetails?.equipment?.reduce((sum, item) => sum + Number(item.cost_per_month), 0) * 12).toFixed(
                  2
                )}
              </Typography>
            </Box>
          </Card>
        </Box>
        <Grid container sx={{ justifyContent: 'space-between', mx: 7, my: 2 }}>
          <Typography level='h3'>Equipment</Typography>
          {user.admin === true && (
            <Button
              onClick={() => setOpen(true)}
              sx={{
                backgroundColor: '#008242',
                '&:hover': {
                  backgroundColor: '#00341a',
                },
              }}
            >
              Add Equiment
            </Button>
          )}
          <EquipmentForm open={open} setOpen={setOpen} />
        </Grid>
        <Grid container sx={{ justifyContent: 'center' }} spacing={2}>
          {reportDetails.equipment?.map((e) => (
            <Grid xs={5.5} key={e.id}>
              <ReportEquipmentCard e={e} />
            </Grid>
          ))}
        </Grid>

        <Box
          className='card-container'
          sx={{
            minHeight: 75,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 2,
          }}
        >
          <Card
            className='container-card'
            variant='outlined'
            sx={(theme) => ({
              maxWidth: 800,
              maxHeight: 200,
              flexDirection: 'column',
              overflow: 'auto',
              transition: 'transform 0.3s, border 0.3s',
              border: '1px solid #1F1C4C',
              '&:hover': {
                borderColor: theme.vars.palette.primary.outlinedHoverBorder,
                transform: 'translateY(-2px)',
              },
            })}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                alignContent: 'center',
              }}
            >
              <Typography level='title-lg'>Recommendations</Typography>
              <IconButton onClick={() => setDeleteRecsToggle(!deleteRecsToggle)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => setAddRecToggle(!addRecToggle)}>
                <AddCircleOutlineIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography level='body-sm'>
                {reportDetails?.recommendations?.map((recommendation) =>
                  deleteRecsToggle ? (
                    <li className='recommendation-item' key={recommendation.id}>
                      <IconButton onClick={() => deleteRecommendation(recommendation.id)}>
                        <ClearIcon />
                      </IconButton>
                      {recommendation.recommendation}
                    </li>
                  ) : (
                    <li key={recommendation.id}>{recommendation.recommendation}</li>
                  )
                )}
                {addRecToggle ? (
                  <form onSubmit={submitRec}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <input
                        className='form-control'
                        id='recommendations'
                        type='text'
                        placeholder='New Recommendation'
                        value={newRec.recommendations}
                        onChange={handleNewRec}
                      />
                      <Button type='submit' color='success'>
                        Submit
                      </Button>
                    </Box>
                  </form>
                ) : (
                  ''
                )}
              </Typography>
            </Box>
          </Card>
        </Box>
        <Box
          className='card-container'
          sx={{
            minHeight: 75,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 2,
          }}
        >
          <Card
            className='container-card'
            variant='outlined'
            sx={(theme) => ({
              maxWidth: 800,
              maxHeight: 200,
              flexDirection: 'column',
              overflow: 'auto',
              transition: 'transform 0.3s, border 0.3s',
              border: '1px solid #1F1C4C',
              '&:hover': {
                borderColor: theme.vars.palette.primary.outlinedHoverBorder,
                transform: 'translateY(-2px)',
              },
            })}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                alignContent: 'center',
              }}
            >
              <Typography level='title-lg'>Report Notes</Typography>
              {user.admin ? (
                <IconButton onClick={() => setEditNotesToggle(!editNotesToggle)}>
                  <EditIcon />
                </IconButton>
              ) : (
                ''
              )}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {editNotesToggle ? (
                <form onSubmit={submitNotes}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      className='form-control'
                      id='recommendations'
                      type='text'
                      placeholder='Edit Notes'
                      value={reportDetails?.notes}
                      onChange={(event) =>
                        dispatch({
                          type: 'EDIT_REPORT_DETAILS',
                          payload: { notes: event.target.value },
                        })
                      }
                    />
                    <Button color='success' type='submit'>
                      Submit
                    </Button>
                  </Box>
                </form>
              ) : (
                <Typography level='body-sm'>{reportDetails.notes}</Typography>
              )}
            </Box>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
