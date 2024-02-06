import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { medications } from '@/lib/constants';

export default function MedicationsTable() {
  return (
    <div className='m-4'>
      <Card>
        <CardHeader>
          <CardTitle>Medications</CardTitle>
          <CardDescription>Common inhalers</CardDescription>
        </CardHeader>
        <CardContent>
          <Table className='border-t mt-4'>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Actuations</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medications.map(({ name, actuations }) => (
                <TableRow key={name}>
                  <TableCell>{name}</TableCell>
                  <TableCell>{actuations.join(', ')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
