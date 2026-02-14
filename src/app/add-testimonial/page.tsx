import { AddTestimonialForm } from '@/components/AddTestimonialForm';
import { Toaster } from '@/components/ui/toaster';

export default function Page() {
    return (
        <div>
            <section className="flex max-w-3xl justify-center items-center m-auto p-5">
                <AddTestimonialForm />
            </section>
            <Toaster />
        </div>
    );
}
