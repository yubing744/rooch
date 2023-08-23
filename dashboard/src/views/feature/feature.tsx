// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'

const FeatureView = () => {
  return (
    <Card sx={{ position: 'relative' }}>
      <CardContent sx={{ py: theme => `${theme.spacing(5)} !important` }}>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={12} sx={{ textAlign: ['center'] }}>
            <Typography variant='h5' sx={{ mb: 4, color: 'primary.main' }}>
              This feature is not yet supported 🎉
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              Accelerating World's Transition to Decentralization.
            </Typography>
            <Typography sx={{ mb: 3, color: 'text.secondary' }}></Typography>
            <Button size='small' variant='outlined'>
              Give us the star
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default FeatureView
