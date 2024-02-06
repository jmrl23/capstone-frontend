import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function SummaryDialog({ data, isOpen, onOpenChange }: Props) {
  if (!data) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Summary</DialogTitle>
        </DialogHeader>
        <p className='text-justify'>
          Throughout the entirety of the month of{' '}
          <span className='underline text-blue-500'>{data.name}</span>,
          encompassing its entire duration, it has come to my attention that you
          have availed yourself of the inhaler on a total of{' '}
          <span className='underline text-blue-500'>{data.total}</span>{' '}
          occasions. This noteworthy frequency of usage reflects your commitment
          to managing and addressing respiratory concerns, demonstrating a
          conscientious approach to your well-being during this specific time
          frame.
        </p>

        <p className='text-justify'>
          Here are targeted recommendations to boost your health. Implementing
          these suggestions into your routine can lead to a more balanced and
          thriving lifestyle:
        </p>

        <div className='mx-4'>
          <ul className='list-[upper-alpha]'>
            <li>
              <span className='font-bold'>Take Medication - </span>
              Use prescribed inhalers as directed.
            </li>
            <li>
              <span className='font-bold'>Avoid Triggers - </span>
              Stay away from smoke, pollution, and allergens.
            </li>
            <li>
              <span className='font-bold'>Regular Check-ups - </span>
              Visit your doctor for monitoring and adjustments.
            </li>
            <li>
              <span className='font-bold'>Follow Action Plan - </span>
              Have a plan for emergencies.
            </li>
            <li>
              <span className='font-bold'>Stay Active - </span>
              Engage in regular exercise like swimming or walking.
            </li>
            <li>
              <span className='font-bold'>Healthy Living - </span>
              Eat well, exercise, and manage stress.
            </li>
            <li>
              <span className='font-bold'>Get Vaccinated - </span>
              Stay up-to-date on flu and pneumonia shots.
            </li>
            <li>
              <span className='font-bold'>Emergency Kit - </span>
              Keep rescue inhaler and contacts handy.
            </li>
            <li>
              <span className='font-bold'>Control Environment - </span>
              Use air purifiers and masks as needed.
            </li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export interface Props {
  data: { name: string; total: number } | null;
  isOpen: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}
