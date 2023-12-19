import { PlugIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';

export default function NoDevice() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>No device</CardTitle>
        <CardDescription>You haven't yet added any devices</CardDescription>
      </CardHeader>
      <CardContent>
        You can start adding your device by pressing the{' '}
        <span className='bg-gray-100 p-2 rounded'>
          <PlugIcon className='inline-block' />
          connect botton
        </span>
        .
      </CardContent>
    </Card>
  );
}
