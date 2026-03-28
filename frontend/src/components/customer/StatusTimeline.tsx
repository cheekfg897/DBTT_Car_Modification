import { Check } from 'lucide-react';

const STEPS = [
  { label: 'Confirmed',           sublabel: 'Booking received' },
  { label: 'Workshop Preparing',  sublabel: 'Getting your bay ready' },
  { label: 'In Progress',         sublabel: 'Work underway' },
  { label: 'Completed',           sublabel: 'Ready for collection' },
];

function getActiveStep(status: string): number {
  switch (status) {
    case 'pending':     return 1;
    case 'in-progress': return 2;
    case 'done':        return 4;
    default:            return 0;
  }
}

interface Props {
  status: 'pending' | 'in-progress' | 'done' | 'cancelled';
}

export function StatusTimeline({ status }: Props) {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-2 py-2">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <span className="text-sm text-red-400 font-medium">Booking Cancelled</span>
      </div>
    );
  }

  const activeStep = getActiveStep(status);

  return (
    <div className="flex items-start w-full">
      {STEPS.map((step, i) => {
        const done   = i < activeStep;
        const active = i === activeStep && activeStep < 4;
        return (
          <div key={i} className="flex-1 flex flex-col items-center">
            <div className="flex items-center w-full">
              <div className={`flex-1 h-0.5 ${i === 0 ? 'invisible' : done || active ? 'bg-orange-500' : 'bg-zinc-700'}`} />
              <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${
                done   ? 'bg-orange-500 border-orange-500' :
                active ? 'bg-zinc-900 border-orange-500' :
                         'bg-zinc-900 border-zinc-700'
              }`}>
                {done   ? <Check size={13} className="text-white" /> :
                 active ? <div className="w-2 h-2 rounded-full bg-orange-500" /> :
                          null}
              </div>
              <div className={`flex-1 h-0.5 ${i === STEPS.length - 1 ? 'invisible' : done ? 'bg-orange-500' : 'bg-zinc-700'}`} />
            </div>
            <p className={`text-xs font-semibold mt-2 text-center ${done || active ? 'text-white' : 'text-zinc-600'}`}>
              {step.label}
            </p>
            <p className="text-[10px] text-zinc-500 text-center mt-0.5">{step.sublabel}</p>
          </div>
        );
      })}
    </div>
  );
}
