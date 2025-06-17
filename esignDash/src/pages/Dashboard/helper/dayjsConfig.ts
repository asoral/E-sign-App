import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/en-gb';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(relativeTime);
dayjs.locale('en-gb');
dayjs.extend(advancedFormat);

export default dayjs;
