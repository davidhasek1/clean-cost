import {
  Button,
  Stack,
  TextField,
  Typography,
  Paper,
  Container,
} from '@mui/material';
import { useTypedForm } from './useForm';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { binResponseSchema } from './service/schema';

const schema = z.object({
  base_price: z.string(),
  beds_number: z.string(),
  baths_number: z.string(),
  /*   kitchen_number: z.string(),
  living_room_number: z.string(), */
  distance_km: z.string(),
  cleaning_props_percentage: z.string(),
});

function App() {
  const [data, setData] = useState<z.infer<typeof binResponseSchema>>();
  const [finalPrice, setFinalPrice] = useState(0);

  const form = useTypedForm({
    schema: schema,
    defaultValues: {
      beds_number: '2',
      baths_number: '2',
      /*   kitchen_number: '1',
      living_room_number: '1', */
      distance_km: '0',
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/settings.json');
      const { data } = binResponseSchema.safeParse(await res.json());
      setData(data);
    };
    fetchData();
  }, []);

  console.log(data);

  useEffect(() => {
    form.setValue('base_price', data?.defaults.base_price.toString() ?? '0');
    form.setValue(
      'cleaning_props_percentage',
      data?.defaults.cleaning_props_percentage.toString() ?? '0'
    );
  }, [data, form]);

  console.log(form.formState.errors);

  const onSubmit = (formData: z.infer<typeof schema>) => {
    if (!data || !data.defaults) return;

    const price =
      (Number(formData.base_price) +
        Number(formData.beds_number) * data.defaults.beds_price +
        Number(formData.baths_number) * data.defaults.baths_price +
        /*  Number(formData.kitchen_number) * */ data.defaults.kitchen_price +
        /*  Number(formData.living_room_number) *  */ data.defaults
          .living_room_price +
        Number(formData.distance_km) * data.defaults.price_for_km) *
      (1 + data.defaults.cleaning_props_percentage);
    setFinalPrice(price);
  };

  return (
    <Container maxWidth='sm'>
      <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
        <Stack spacing={3} alignItems='center'>
          <Typography variant='h4' component='h1' gutterBottom>
            Kalkulačka ceny úklidu
          </Typography>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            style={{ width: '100%' }}
          >
            <Stack spacing={2}>
              <TextField
                type='number'
                {...form.register('base_price')}
                label='Základní cena'
                fullWidth
                variant='outlined'
              />
              <TextField
                type='number'
                {...form.register('beds_number')}
                label='Počet ložnic'
                fullWidth
                variant='outlined'
              />
              <TextField
                type='number'
                {...form.register('baths_number')}
                label='Počet koupelen'
                fullWidth
                variant='outlined'
              />
              <TextField
                type='number'
                {...form.register('distance_km')}
                label='Vzdálenost v km'
                fullWidth
                variant='outlined'
              />
              {/* <TextField
                type='number'
                {...form.register('kitchen_number')}
                label='Počet kuchyní'
                fullWidth
                variant='outlined'
              />
              <TextField
                type='number'
                {...form.register('living_room_number')}
                label='Počet obývacích pokojů'
                fullWidth
                variant='outlined'
              /> */}
              {/*    <TextField
                type='text'
                {...form.register('cleaning_props_percentage')}
                label='Koeficient přípravků (%)'
                fullWidth
                variant='outlined'
              /> */}

              <Button
                variant='contained'
                type='submit'
                size='large'
                sx={{ mt: 2 }}
              >
                Vypočítat cenu
              </Button>
            </Stack>
          </form>

          {finalPrice > 0 && (
            <Paper
              elevation={2}
              sx={{
                backgroundColor: 'success.main',
                color: 'white',
                width: '100%',
                p: 3,
                mt: 2,
                borderRadius: 2,
                textAlign: 'center',
              }}
            >
              <Typography variant='h6' gutterBottom>
                Celková cena
              </Typography>
              <Typography variant='h4' fontWeight='bold'>
                {finalPrice.toFixed(2)} €
              </Typography>
            </Paper>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}

export default App;
