import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Container, Box, Button, Grid } from '@mui/joy';
import Card from '@mui/joy/Card';
import Typography from '@mui/joy/Typography';
import { DateTime } from 'luxon';
import './EnergyReport.css';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

export default function EnergyReport() {
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams();
  const user = useSelector((store) => store.user);
  const reportDetails = useSelector((store) => store.reports.reportDetails);
  console.log('check reportDetails', reportDetails);

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
    dispatch({ type: 'UPDATE_NOTES', payload: { reportId: reportDetails.id, notes: reportDetails.notes } });
    setEditNotesToggle(!editNotesToggle);
  };
  // edit recommendations
  const [editRecsToggle, setEditRecsToggle] = useState(false);

  const submitRecommendationEdit = (recommendationId) => {
    console.log('in submitRecommendations, check rec id', recommendationId);
    // dispatch({type: 'UPDATE_RECOMMENDATION', payload: {}})
  };

  return (
    <Box sx={{ flex: 1 }}>
      <h1 className='energy-report-header'>{reportDetails.name} Energy Report</h1>
      <Grid container sx={{ justifyContent: 'space-between', mx: 6, mt: 3 }}>
        <Button onClick={navReports} sx={{ width: '12vw' }}>
          Back to all Reports
        </Button>
        {user.admin ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {!reportDetails.approved ? (
              <Button onClick={() => approveReport(reportDetails.id)}>Approve</Button>
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
            margin: 3,
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
              <Typography level='body-sm'>{Math.round(reportDetails.current_carbon_footprint)} Tons/year</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography level='title-lg'>Annual Energy Cost</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography level='body-sm'>${Math.round(reportDetails.current_monthly_cost * 12)}/year</Typography>
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
            margin: 3,
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
              <div>
                <Typography level='title-lg'>Recommendations</Typography>
              </div>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <div>
                <Typography level='body-sm'>
                  {reportDetails?.recommendations?.map((recommendation, index) => (
                    <li key={index}>
                      {recommendation}
                      <IconButton onClick={() => setEditRecsToggle(!editRecsToggle)}>
                        <EditIcon />
                      </IconButton>
                    </li>
                  ))}
                </Typography>
              </div>
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
            margin: 3,
          }}
        >
          <Card
            className='container-card'
            variant='outlined'
            sx={(theme) => ({
              maxWidth: 800,
              maxHeight: 200,
              flexDirection: 'column',
              overflow: 'scroll',
              transition: 'transform 0.3s, border 0.3s',
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
                    <textarea
                      className='text-area'
                      rows='3'
                      placeholder='Edit Notes'
                      value={reportDetails?.notes}
                      onChange={(event) =>
                        dispatch({ type: 'EDIT_REPORT_DETAILS', payload: { notes: event.target.value } })
                      }
                    ></textarea>
                  </Box>
                  <Button color='success' type='submit'>
                    Submit
                  </Button>
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
