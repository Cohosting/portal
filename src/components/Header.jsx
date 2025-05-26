const Header = ({ title, subTitle }) => (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
            alt="Your Company"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            {title}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 max-w">
            {subTitle}
        </p>
    </div>
);

export default Header;