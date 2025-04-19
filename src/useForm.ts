import { FieldValues, UseFormProps, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CustomUseFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown
> = Omit<UseFormProps<TFieldValues, TContext>, 'resolver'> & {
  readonly schema: z.Schema<TFieldValues>;
};

const useTypedForm = <
  TFieldValues extends FieldValues = FieldValues,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TContext = any
>(
  props: CustomUseFormProps<TFieldValues, TContext>
): UseFormReturn<TFieldValues, TContext> =>
  useForm({
    resolver: zodResolver(props.schema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    ...props,
  });

export { useTypedForm };
