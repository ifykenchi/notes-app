import moment from "moment";
import { MdOutlinePushPin, MdCreate, MdDelete } from "react-icons/md";
import type { NoteCardProps } from "../../interfaces/components";

const NoteCard = ({
	title,
	date,
	content,
	tags,
	isPinned,
	onEdit,
	onDelete,
	onPinNote,
}: NoteCardProps) => {
	return (
		<div className='border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out'>
			<div className='flex items-center justify-between'>
				<div>
					<h6 className='text-sm font-medium'>{title}</h6>
					<span className='text-xs text-slate-500'>
						{moment(date).format("Do MMM YYYY")}
					</span>
				</div>

				<MdOutlinePushPin
					className={`text-xl cursor-pointer hover:text-primary ${
						isPinned ? "text-primary" : "text-slate-300"
					}`}
					onClick={onPinNote}
				/>
			</div>

			<p className='text-xs text-slate-600 mt-2'>{content?.slice(0, 60)}</p>

			<div className='flex items-center justify-between mt-2'>
				<div className='text-xs text-slate-500'>
					{tags.map((item) => `#${item} `)}
				</div>

				<div className='flex items-center gap-2'>
					<MdCreate
						className='text-xl text-slate-300 cursor-pointer hover:text-green-600'
						onClick={onEdit}
					/>
					<MdDelete
						className='text-xl text-slate-300 cursor-pointer hover:text-red-500'
						onClick={onDelete}
					/>
				</div>
			</div>
		</div>
	);
};

export default NoteCard;
