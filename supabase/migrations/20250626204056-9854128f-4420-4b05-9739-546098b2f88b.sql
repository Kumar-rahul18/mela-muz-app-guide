
ALTER TABLE public.vehicle_registrations 
ADD COLUMN parking_location TEXT;

UPDATE public.vehicle_registrations 
SET parking_location = 'parking-1' 
WHERE parking_location IS NULL;

ALTER TABLE public.vehicle_registrations 
ALTER COLUMN parking_location SET NOT NULL;

ALTER TABLE public.vehicle_unparking_records 
ADD COLUMN unparker_photo_url_2 TEXT;
