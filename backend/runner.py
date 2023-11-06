from set_env import setup_env

setup_env()


from app.main import app as core_app  # noqa: E402


def run_coreserver():
    core_app.run(debug=True, port=5000, host="0.0.0.0")


if __name__ == "__main__":
    from sys import argv

    run_coreserver()
